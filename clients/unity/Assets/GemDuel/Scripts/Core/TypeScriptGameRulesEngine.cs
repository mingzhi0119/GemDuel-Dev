using System;
using System.Diagnostics;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Core
{
    public sealed class TypeScriptGameRulesEngine : IGameRulesEngine
    {
        private readonly Func<JObject, JObject> executeBridgeRequest;
        private JObject initSnapshot = new JObject();

        public TypeScriptGameRulesEngine()
            : this(new TypeScriptRulesBridgeProcessClient().Execute) { }

        public TypeScriptGameRulesEngine(Func<JObject, JObject> executeBridgeRequest)
        {
            this.executeBridgeRequest =
                executeBridgeRequest
                ?? throw new ArgumentNullException(nameof(executeBridgeRequest));
        }

        public GameRulesResult StartLocalGame(string seed, bool useBuffs = false)
        {
            var response = executeBridgeRequest(
                new JObject
                {
                    ["kind"] = "start",
                    ["mode"] = "LOCAL_PVP",
                    ["useBuffs"] = useBuffs,
                    ["seed"] = string.IsNullOrWhiteSpace(seed) ? "unity-localdev" : seed,
                    ["hostPlayer"] = "p1",
                }
            );

            return BuildResult(response, true);
        }

        public void RestoreSession(JObject init)
        {
            initSnapshot = init == null ? new JObject() : (JObject)init.DeepClone();
        }

        public GameRulesResult ApplyCommand(GameState state, GameRulesCommand command)
        {
            if (initSnapshot.Count == 0)
            {
                return GameRulesResult.Fail(
                    "BRIDGE_NOT_STARTED",
                    "StartLocalGame must be called before applying Unity rules commands."
                );
            }

            if (state == null)
            {
                return GameRulesResult.Fail("STATE_REQUIRED", "A current game state is required.");
            }

            if (command == null || string.IsNullOrWhiteSpace(command.Type))
            {
                return GameRulesResult.Fail(
                    "COMMAND_REQUIRED",
                    "A command with a non-empty type is required."
                );
            }

            var actor = string.IsNullOrWhiteSpace(command.Actor) ? state.Turn : command.Actor;
            var response = executeBridgeRequest(
                new JObject
                {
                    ["kind"] = "apply",
                    ["init"] = (JObject)initSnapshot.DeepClone(),
                    ["state"] = (JObject)state.Snapshot.DeepClone(),
                    ["actor"] = actor,
                    ["command"] = new JObject
                    {
                        ["type"] = command.Type,
                        ["actor"] = actor,
                        ["payload"] = command.Payload ?? new JObject(),
                    },
                }
            );

            return BuildResult(response, false);
        }

        private GameRulesResult BuildResult(JObject response, bool captureInit)
        {
            if (response == null)
            {
                return GameRulesResult.Fail("BRIDGE_EMPTY_RESPONSE", "Bridge response was empty.");
            }

            var init = response["init"] as JObject ?? initSnapshot;
            if (captureInit && init.Count > 0)
            {
                initSnapshot = (JObject)init.DeepClone();
            }

            var state = response["state"] as JObject;
            var stateHash = response.Value<string>("stateHash") ?? string.Empty;
            var replayRevision = response.Value<int?>("replayRevision") ?? 0;
            var actionType = response.Value<string>("actionType") ?? string.Empty;

            if (response.Value<bool>("ok"))
            {
                return GameRulesResult.Pass(state, init, stateHash, replayRevision, actionType);
            }

            var rejection = response["rejection"] as JObject;
            return GameRulesResult.Fail(
                rejection?.Value<string>("code") ?? "BRIDGE_REJECTED",
                rejection?.Value<string>("reason") ?? "Bridge rejected the command.",
                state,
                init,
                stateHash,
                replayRevision,
                actionType
            );
        }
    }

    public sealed class TypeScriptRulesBridgeProcessClient
    {
        private const int DefaultTimeoutMilliseconds = 30000;
        private readonly string repositoryRoot;
        private readonly int timeoutMilliseconds;

        public TypeScriptRulesBridgeProcessClient()
            : this(ResolveRepositoryRoot(), DefaultTimeoutMilliseconds) { }

        public TypeScriptRulesBridgeProcessClient(string repositoryRoot, int timeoutMilliseconds)
        {
            this.repositoryRoot = repositoryRoot;
            this.timeoutMilliseconds = timeoutMilliseconds;
        }

        public JObject Execute(JObject request)
        {
            var requestPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid() + ".json");
            try
            {
                File.WriteAllText(requestPath, request.ToString(Formatting.None));
                return ExecuteRequestFile(requestPath);
            }
            finally
            {
                if (File.Exists(requestPath))
                {
                    File.Delete(requestPath);
                }
            }
        }

        private JObject ExecuteRequestFile(string requestPath)
        {
            var startInfo = BuildStartInfo(requestPath);
            using (var process = new Process())
            {
                process.StartInfo = startInfo;
                process.Start();
                var stdoutTask = process.StandardOutput.ReadToEndAsync();
                var stderrTask = process.StandardError.ReadToEndAsync();

                if (!process.WaitForExit(timeoutMilliseconds))
                {
                    try
                    {
                        process.Kill();
                    }
                    catch (InvalidOperationException) { }

                    throw new TimeoutException("Unity TypeScript rules bridge timed out.");
                }

                var stdout = stdoutTask.Result;
                var stderr = stderrTask.Result;

                if (!string.IsNullOrWhiteSpace(stdout))
                {
                    return JObject.Parse(stdout);
                }

                throw new InvalidOperationException(
                    "Unity TypeScript rules bridge produced no JSON output. Exit code "
                        + process.ExitCode
                        + ": "
                        + stderr
                );
            }
        }

        private ProcessStartInfo BuildStartInfo(string requestPath)
        {
            var toolsScripts = Path.Combine(repositoryRoot, "tools", "scripts");
            var bridgeScript = Path.Combine(
                repositoryRoot,
                "tools",
                "migration",
                "unity-rules-engine-bridge.ts"
            );

            var startInfo = new ProcessStartInfo
            {
                WorkingDirectory = repositoryRoot,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            if (Application.platform == RuntimePlatform.WindowsEditor || Application.platform == RuntimePlatform.WindowsPlayer)
            {
                startInfo.FileName = Environment.GetEnvironmentVariable("ComSpec") ?? "cmd.exe";
                startInfo.Arguments =
                    "/d /s /c \"pnpm --dir "
                    + Quote(toolsScripts)
                    + " exec vite-node --script "
                    + Quote(bridgeScript)
                    + " "
                    + Quote(requestPath)
                    + "\"";
            }
            else
            {
                startInfo.FileName = "pnpm";
                startInfo.Arguments =
                    "--dir "
                    + Quote(toolsScripts)
                    + " exec vite-node --script "
                    + Quote(bridgeScript)
                    + " "
                    + Quote(requestPath);
            }

            return startInfo;
        }

        private static string ResolveRepositoryRoot()
        {
            var configured = Environment.GetEnvironmentVariable("GEMDUEL_REPOSITORY_ROOT");
            if (!string.IsNullOrWhiteSpace(configured))
            {
                return Path.GetFullPath(configured);
            }

            return Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
        }

        private static string Quote(string value)
        {
            return "\"" + value.Replace("\"", "\\\"") + "\"";
        }
    }
}
