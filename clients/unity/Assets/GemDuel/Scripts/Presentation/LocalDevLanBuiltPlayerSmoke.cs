using System;
using System.Diagnostics;
using System.Threading;
using Newtonsoft.Json.Linq;

namespace GemDuel.Presentation
{
    public sealed class LocalDevLanBuiltPlayerSmokeOptions
    {
        public string Role { get; set; } = "host";
        public string Host { get; set; } = "127.0.0.1";
        public int Port { get; set; } = 9777;
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
        public int TimeoutMs { get; set; } = 20000;
    }

    public static class LocalDevLanBuiltPlayerSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevLanBuiltPlayerSmokeOptions options
        )
        {
            options = options ?? new LocalDevLanBuiltPlayerSmokeOptions();
            var role = NormalizeRole(options.Role);
            var steps = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-lan-built-player-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["role"] = role,
                ["host"] = options.Host,
                ["port"] = options.Port,
                ["viewport"] = new JObject
                {
                    ["width"] = options.ViewportWidth,
                    ["height"] = options.ViewportHeight,
                },
                ["steps"] = steps,
                ["ok"] = false,
            };

            try
            {
                controller.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
                controller.ConfigureLanForAutomation(options.Host, options.Port);
                controller.LoadMainMenuForAutomation();

                if (role == "host")
                {
                    RunHost(controller, options, report, steps);
                }
                else if (role == "client")
                {
                    RunClient(controller, options, report, steps);
                }
                else
                {
                    throw new InvalidOperationException("Unknown LAN smoke role: " + options.Role);
                }

                report["completedAt"] = DateTime.UtcNow.ToString("O");
            }
            catch (Exception ex)
            {
                report["ok"] = false;
                report["failureReason"] = ex.Message;
                report["failureDetail"] = ex.ToString();
                report["failureState"] = TryBuildState(controller, options);
                report["completedAt"] = DateTime.UtcNow.ToString("O");
            }

            return report;
        }

        private static void RunHost(
            GemDuelGameController controller,
            LocalDevLanBuiltPlayerSmokeOptions options,
            JObject report,
            JArray steps
        )
        {
            RequireStep(controller, "open_lan", null, options, steps);
            RequireStep(controller, "host_lan", null, options, steps);

            var hosted = WaitFor(
                controller,
                options,
                "host authoritative snapshot",
                state => Lan(state).Value<bool>("hostAuthoritative")
                    && !string.IsNullOrWhiteSpace(Lan(state).Value<string>("stateHash"))
            );
            report["hostInitial"] = Summarize(hosted);

            var connected = WaitFor(
                controller,
                options,
                "client TCP connection",
                state =>
                {
                    var lan = Lan(state);
                    return !string.IsNullOrWhiteSpace(lan.Value<string>("remoteEndpoint"))
                        || (lan.Value<string>("connectionStatus") ?? string.Empty).IndexOf(
                            "connected",
                            StringComparison.OrdinalIgnoreCase
                        ) >= 0;
                }
            );
            report["connected"] = Summarize(connected);

            if (connected.Value<string>("phase") != "IDLE" || connected.Value<string>("turn") != "p1")
            {
                throw new InvalidOperationException(
                    "Expected host p1 IDLE turn before first LAN action, got phase="
                        + connected.Value<string>("phase")
                        + ", turn="
                        + connected.Value<string>("turn")
                        + "."
                );
            }

            var beforeRevision = Lan(connected).Value<int>("replayRevision");
            RequireTakeGemsTurn(controller, options, steps);
            var afterHostAction = WaitFor(
                controller,
                options,
                "host committed action",
                state => Lan(state).Value<int>("replayRevision") >= beforeRevision + 1
                    && state.Value<string>("turn") == "p2"
                    && !string.IsNullOrWhiteSpace(Lan(state).Value<string>("stateHash"))
            );
            report["afterHostAction"] = Summarize(afterHostAction);

            var afterClientAction = WaitFor(
                controller,
                options,
                "client committed action",
                state => Lan(state).Value<int>("replayRevision") >= beforeRevision + 2
                    && state.Value<string>("turn") == "p1"
                    && !string.IsNullOrWhiteSpace(Lan(state).Value<string>("stateHash"))
            );
            report["final"] = Summarize(afterClientAction);
            report["ok"] = true;
        }

        private static void RunClient(
            GemDuelGameController controller,
            LocalDevLanBuiltPlayerSmokeOptions options,
            JObject report,
            JArray steps
        )
        {
            RequireStep(controller, "open_lan", null, options, steps);
            RequireStep(controller, "join_lan", null, options, steps);

            var joined = WaitFor(
                controller,
                options,
                "client host snapshot",
                state => Lan(state).Value<bool>("clientIntentOnly")
                    && Lan(state).Value<string>("localPlayer") == "p2"
                    && !string.IsNullOrWhiteSpace(Lan(state).Value<string>("stateHash"))
            );
            report["joined"] = Summarize(joined);

            var readyForClientTurn = WaitFor(
                controller,
                options,
                "client p2 turn",
                state => state.Value<string>("phase") == "IDLE"
                    && state.Value<string>("turn") == "p2"
                    && Lan(state).Value<int>("replayRevision") >= 1
            );
            report["beforeClientAction"] = Summarize(readyForClientTurn);

            var beforeRevision = Lan(readyForClientTurn).Value<int>("replayRevision");
            RequireTakeGemsTurn(controller, options, steps);
            var afterClientAction = WaitFor(
                controller,
                options,
                "client command result snapshot",
                state => Lan(state).Value<int>("replayRevision") >= beforeRevision + 1
                    && state.Value<string>("turn") == "p1"
                    && !string.IsNullOrWhiteSpace(Lan(state).Value<string>("stateHash"))
            );
            report["final"] = Summarize(afterClientAction);
            report["ok"] = true;
        }

        private static void RequireStep(
            GemDuelGameController controller,
            string action,
            JObject payload,
            LocalDevLanBuiltPlayerSmokeOptions options,
            JArray steps
        )
        {
            var before = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var target = FindTarget(before, action, payload);
            var ok = controller.RunSemanticActionForAutomation(action, payload ?? new JObject(), out var error);
            var after = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            steps.Add(
                new JObject
                {
                    ["action"] = action,
                    ["ok"] = ok,
                    ["error"] = string.IsNullOrEmpty(error) ? null : error,
                    ["driver"] = controller.LastAutomationDriver,
                    ["detail"] = controller.LastAutomationDetail,
                    ["hitTarget"] = target,
                    ["before"] = Summarize(before),
                    ["after"] = Summarize(after),
                }
            );
            if (!ok)
            {
                throw new InvalidOperationException(action + " failed: " + error);
            }
        }

        private static void RequireTakeGemsTurn(
            GemDuelGameController controller,
            LocalDevLanBuiltPlayerSmokeOptions options,
            JArray steps
        )
        {
            var before = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var gemTarget = FindFirstClickableBoardGem(before);
            if (gemTarget == null)
            {
                throw new InvalidOperationException(
                    "No clickable Unity board gem target for LAN take-gems action."
                );
            }

            var payload = new JObject
            {
                ["row"] = gemTarget.Value<int>("row"),
                ["column"] = gemTarget.Value<int>("column"),
            };
            RequireStep(controller, "click_board_cell", payload, options, steps);

            var afterClick = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var confirmTarget = FindTarget(afterClick, "confirm_gem_selection", null);
            if (confirmTarget == null || confirmTarget.Value<bool?>("clickable") != true)
            {
                throw new InvalidOperationException(
                    "No clickable Unity confirm target after LAN board gem selection."
                );
            }

            RequireStep(controller, "confirm_gem_selection", null, options, steps);
        }

        private static JObject WaitFor(
            GemDuelGameController controller,
            LocalDevLanBuiltPlayerSmokeOptions options,
            string description,
            Func<JObject, bool> condition
        )
        {
            var stopwatch = Stopwatch.StartNew();
            JObject last = null;
            while (stopwatch.ElapsedMilliseconds < Math.Max(1000, options.TimeoutMs))
            {
                last = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                if (condition(last))
                {
                    return last;
                }

                Thread.Sleep(50);
            }

            throw new TimeoutException(
                "Timed out waiting for "
                    + description
                    + ". Last state: "
                    + Summarize(last).ToString(Newtonsoft.Json.Formatting.None)
            );
        }

        private static JObject Summarize(JObject state)
        {
            if (state == null)
            {
                return null;
            }

            return new JObject
            {
                ["phase"] = state.Value<string>("phase"),
                ["turn"] = state.Value<string>("turn"),
                ["winner"] = state.Value<string>("winner"),
                ["statusText"] = state.Value<string>("statusText"),
                ["errorBanner"] = state["errorBanner"]?.DeepClone(),
                ["lan"] = state["lan"]?.DeepClone(),
            };
        }

        private static JObject TryBuildState(
            GemDuelGameController controller,
            LocalDevLanBuiltPlayerSmokeOptions options
        )
        {
            try
            {
                return Summarize(
                    controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight)
                );
            }
            catch
            {
                return null;
            }
        }

        private static JObject Lan(JObject state)
        {
            return state?["lan"] as JObject ?? new JObject();
        }

        private static JObject FindTarget(JObject state, string action, JObject payload)
        {
            var visibleTargets = state?["visibleTargets"] as JArray;
            if (visibleTargets == null)
            {
                return null;
            }

            if (action == "click_board_cell")
            {
                var row = payload?.Value<int?>("row");
                var column = payload?.Value<int?>("column");
                if (row.HasValue && column.HasValue)
                {
                    foreach (var token in visibleTargets)
                    {
                        var target = token as JObject;
                        if (
                            target != null
                            && target.Value<string>("kind") == "Gem"
                            && target.Value<int?>("row") == row.Value
                            && target.Value<int?>("column") == column.Value
                        )
                        {
                            return SummarizeTarget(target);
                        }
                    }
                }
            }

            var eventType = EventTypeForAction(action);
            foreach (var token in visibleTargets)
            {
                var target = token as JObject;
                if (target == null)
                {
                    continue;
                }

                if (target.Value<string>("eventType") == eventType)
                {
                    return SummarizeTarget(target);
                }
            }

            return null;
        }

        private static JObject FindFirstClickableBoardGem(JObject state)
        {
            var visibleTargets = state?["visibleTargets"] as JArray;
            if (visibleTargets == null)
            {
                return null;
            }

            foreach (var token in visibleTargets)
            {
                var target = token as JObject;
                if (target == null || target.Value<string>("kind") != "Gem")
                {
                    continue;
                }

                if (target.Value<bool?>("clickable") != true)
                {
                    continue;
                }

                var gemId = target.Value<string>("gemId") ?? string.Empty;
                if (gemId == "empty" || gemId == "gold")
                {
                    continue;
                }

                return target;
            }

            return null;
        }

        private static JObject SummarizeTarget(JObject target)
        {
            if (target == null)
            {
                return null;
            }

            return new JObject
            {
                ["kind"] = target.Value<string>("kind"),
                ["eventType"] = target.Value<string>("eventType"),
                ["semanticKey"] = target.Value<string>("semanticKey"),
                ["row"] = target.Value<int?>("row"),
                ["column"] = target.Value<int?>("column"),
                ["gemId"] = target.Value<string>("gemId"),
                ["rect"] = target["rect"]?.DeepClone(),
                ["clickable"] = target.Value<bool?>("clickable") ?? false,
            };
        }

        private static string EventTypeForAction(string action)
        {
            switch (action)
            {
                case "open_lan":
                    return "open_lan";
                case "host_lan":
                    return "lan-host";
                case "join_lan":
                    return "lan-join";
                case "confirm_gem_selection":
                    return "confirm-gems";
                case "replenish":
                    return "replenish";
                default:
                    return action;
            }
        }

        private static string NormalizeRole(string role)
        {
            return string.IsNullOrWhiteSpace(role) ? "host" : role.Trim().ToLowerInvariant();
        }
    }
}
