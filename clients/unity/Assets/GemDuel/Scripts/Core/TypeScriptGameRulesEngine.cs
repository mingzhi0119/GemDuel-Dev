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
            : this(TypeScriptRulesBridgeClientFactory.CreateDefaultExecutor()) { }

        public TypeScriptGameRulesEngine(Func<JObject, JObject> executeBridgeRequest)
        {
            this.executeBridgeRequest =
                executeBridgeRequest
                ?? throw new ArgumentNullException(nameof(executeBridgeRequest));
        }

        public GameRulesResult StartLocalGame(string seed, bool useBuffs = false)
        {
            return StartGame("LOCAL_PVP", seed, "p1", useBuffs);
        }

        public GameRulesResult StartNetworkGame(string seed, string hostPlayer = "p1", bool useBuffs = false)
        {
            return StartGame(
                "ONLINE_MULTIPLAYER",
                seed,
                string.IsNullOrWhiteSpace(hostPlayer) ? "p1" : hostPlayer,
                useBuffs
            );
        }

        private GameRulesResult StartGame(string mode, string seed, string hostPlayer, bool useBuffs)
        {
            JObject response;
            try
            {
                response = executeBridgeRequest(
                    new JObject
                    {
                        ["kind"] = "start",
                        ["mode"] = mode,
                        ["useBuffs"] = useBuffs,
                        ["seed"] = string.IsNullOrWhiteSpace(seed) ? "unity-localdev" : seed,
                        ["hostPlayer"] = hostPlayer,
                    }
                );
            }
            catch (TimeoutException ex)
            {
                return GameRulesResult.Fail("BRIDGE_TIMEOUT", ex.Message);
            }
            catch (Exception ex)
            {
                return GameRulesResult.Fail("BRIDGE_EXECUTION_FAILED", ex.Message);
            }

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

            JObject response;
            var actor = string.IsNullOrWhiteSpace(command.Actor) ? state.Turn : command.Actor;
            try
            {
                response = executeBridgeRequest(
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
            }
            catch (TimeoutException ex)
            {
                return GameRulesResult.Fail("BRIDGE_TIMEOUT", ex.Message);
            }
            catch (Exception ex)
            {
                return GameRulesResult.Fail("BRIDGE_EXECUTION_FAILED", ex.Message);
            }

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

    public static class TypeScriptRulesBridgeClientFactory
    {
        public const string MailboxEnvironmentVariable = "GEMDUEL_RULES_BRIDGE_MAILBOX_DIR";

        public static Func<JObject, JObject> CreateDefaultExecutor()
        {
            var mailboxDirectory = Environment.GetEnvironmentVariable(MailboxEnvironmentVariable);
            if (!string.IsNullOrWhiteSpace(mailboxDirectory))
            {
                return new TypeScriptRulesBridgeMailboxClient(mailboxDirectory).Execute;
            }

            return new TypeScriptRulesBridgeProcessClient().Execute;
        }
    }

    internal sealed class PackagedRulesRuntime
    {
        public const string EnvironmentVariable = "GEMDUEL_RULES_RUNTIME_DIR";
        private const string RuntimeDirectoryName = "GemDuelRulesRuntime";
        private const string ScriptFileName = "unity-rules-engine-bridge.mjs";
        private const string NodeFileName = "node.exe";

        private PackagedRulesRuntime(string rootDirectory)
        {
            RootDirectory = Path.GetFullPath(rootDirectory);
            ScriptPath = Path.Combine(RootDirectory, ScriptFileName);
            NodePath = Path.Combine(RootDirectory, NodeFileName);
            ManifestPath = Path.Combine(RootDirectory, "manifest.json");
        }

        public string RootDirectory { get; }
        public string ScriptPath { get; }
        public string NodePath { get; }
        public string ManifestPath { get; }

        public static bool TryResolve(out PackagedRulesRuntime runtime)
        {
            runtime = null;
            foreach (var candidate in CandidateDirectories())
            {
                if (string.IsNullOrWhiteSpace(candidate))
                {
                    continue;
                }

                var resolved = new PackagedRulesRuntime(candidate);
                if (resolved.IsAvailable(out _))
                {
                    runtime = resolved;
                    return true;
                }
            }

            return false;
        }

        public bool IsAvailable(out string error)
        {
            error = string.Empty;
            if (!Directory.Exists(RootDirectory))
            {
                error = "Unity packaged rules runtime directory does not exist: " + RootDirectory;
                return false;
            }

            if (!File.Exists(NodePath))
            {
                error = "Unity packaged rules runtime is missing node.exe: " + NodePath;
                return false;
            }

            if (!File.Exists(ScriptPath))
            {
                error = "Unity packaged rules runtime is missing bridge bundle: " + ScriptPath;
                return false;
            }

            if (!File.Exists(ManifestPath))
            {
                error = "Unity packaged rules runtime is missing manifest.json: " + ManifestPath;
                return false;
            }

            return true;
        }

        public ProcessStartInfo BuildMailboxStartInfo(string mailboxDirectory)
        {
            return BuildStartInfo("--mailbox " + Quote(mailboxDirectory));
        }

        public ProcessStartInfo BuildRequestStartInfo(string requestPath, string responsePath)
        {
            return BuildStartInfo(Quote(requestPath) + ResponseFileArgument(responsePath));
        }

        private ProcessStartInfo BuildStartInfo(string bridgeArguments)
        {
            var arguments = Quote(ScriptPath) + " " + bridgeArguments;
            var fileName = NodePath;
            var useShellExecute = Application.platform == RuntimePlatform.WindowsPlayer;
            if (useShellExecute)
            {
                fileName = Environment.GetEnvironmentVariable("ComSpec") ?? "cmd.exe";
                arguments = "/d /s /c " + QuoteCmdCommand(Quote(NodePath) + " " + arguments);
            }

            var startInfo = new ProcessStartInfo
            {
                WorkingDirectory = RootDirectory,
                FileName = fileName,
                Arguments = arguments,
                RedirectStandardOutput = !useShellExecute,
                RedirectStandardError = !useShellExecute,
                UseShellExecute = useShellExecute,
                CreateNoWindow = !useShellExecute,
            };
            if (useShellExecute)
            {
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;
            }

            return startInfo;
        }

        private static string[] CandidateDirectories()
        {
            var configured = Environment.GetEnvironmentVariable(EnvironmentVariable);
            if (!string.IsNullOrWhiteSpace(configured))
            {
                return new[] { Path.GetFullPath(configured) };
            }

            return new[]
            {
                Path.Combine(Application.streamingAssetsPath, RuntimeDirectoryName),
                Path.Combine(Application.dataPath, "StreamingAssets", RuntimeDirectoryName),
            };
        }

        private static string Quote(string value)
        {
            return "\"" + value.Replace("\"", "\\\"") + "\"";
        }

        private static string QuoteCmdCommand(string command)
        {
            return "\"" + command + "\"";
        }

        private static string ResponseFileArgument(string responsePath)
        {
            return string.IsNullOrEmpty(responsePath) ? string.Empty : " --out " + Quote(responsePath);
        }
    }

    public sealed class TypeScriptRulesBridgeMailboxClient
    {
        private const int DefaultTimeoutMilliseconds = 30000;
        private readonly string mailboxDirectory;
        private readonly string requestDirectory;
        private readonly string responseDirectory;
        private readonly int timeoutMilliseconds;

        public TypeScriptRulesBridgeMailboxClient(string mailboxDirectory)
            : this(mailboxDirectory, DefaultTimeoutMilliseconds) { }

        public TypeScriptRulesBridgeMailboxClient(string mailboxDirectory, int timeoutMilliseconds)
        {
            this.mailboxDirectory = Path.GetFullPath(mailboxDirectory ?? string.Empty);
            requestDirectory = Path.Combine(this.mailboxDirectory, "requests");
            responseDirectory = Path.Combine(this.mailboxDirectory, "responses");
            this.timeoutMilliseconds = timeoutMilliseconds > 0
                ? timeoutMilliseconds
                : DefaultTimeoutMilliseconds;
        }

        public JObject Execute(JObject request)
        {
            if (!Directory.Exists(requestDirectory) || !Directory.Exists(responseDirectory))
            {
                throw new InvalidOperationException(
                    "Unity TypeScript rules bridge mailbox is unavailable at "
                        + mailboxDirectory
                        + ". The built-player smoke launcher must create requests/responses."
                );
            }

            var requestId = Guid.NewGuid().ToString("N");
            var requestPath = Path.Combine(requestDirectory, requestId + ".json");
            var requestTempPath = requestPath + ".tmp";
            var responsePath = Path.Combine(responseDirectory, requestId + ".json");
            try
            {
                File.WriteAllText(requestTempPath, request.ToString(Formatting.None));
                File.Move(requestTempPath, requestPath);

                var startedAt = DateTime.UtcNow;
                while ((DateTime.UtcNow - startedAt).TotalMilliseconds < timeoutMilliseconds)
                {
                    if (File.Exists(responsePath))
                    {
                        return ReadJsonWithRetry(responsePath);
                    }

                    System.Threading.Thread.Sleep(25);
                }

                throw new TimeoutException(
                    "Unity TypeScript rules bridge mailbox timed out after "
                        + timeoutMilliseconds
                        + " ms while waiting for "
                        + responsePath
                        + "."
                );
            }
            finally
            {
                DeleteFileIfExists(requestTempPath);
                DeleteFileIfExists(requestPath);
                DeleteFileIfExists(responsePath);
            }
        }

        private JObject ReadJsonWithRetry(string path)
        {
            var startedAt = DateTime.UtcNow;
            Exception lastError = null;
            while ((DateTime.UtcNow - startedAt).TotalMilliseconds < timeoutMilliseconds)
            {
                try
                {
                    return JObject.Parse(File.ReadAllText(path));
                }
                catch (IOException ex)
                {
                    lastError = ex;
                }
                catch (UnauthorizedAccessException ex)
                {
                    lastError = ex;
                }

                System.Threading.Thread.Sleep(25);
            }

            throw new IOException(
                "Unity TypeScript rules bridge mailbox could not read response file after "
                    + timeoutMilliseconds
                    + " ms: "
                    + path,
                lastError
            );
        }

        private static void DeleteFileIfExists(string path)
        {
            try
            {
                if (File.Exists(path))
                {
                    File.Delete(path);
                }
            }
            catch (IOException) { }
            catch (UnauthorizedAccessException) { }
        }
    }

    public sealed class TypeScriptRulesBridgeProcessClient
    {
        private const int DefaultTimeoutMilliseconds = 30000;
        private readonly string repositoryRoot;
        private readonly int timeoutMilliseconds;
        private bool availabilityChecked;
        private string availabilityError = string.Empty;
        private readonly PackagedRulesRuntime packagedRuntime;
        private Process persistentMailboxProcess;
        private TypeScriptRulesBridgeMailboxClient persistentMailboxClient;
        private string persistentMailboxDirectory = string.Empty;

        public TypeScriptRulesBridgeProcessClient()
            : this(ResolveRepositoryRoot(), DefaultTimeoutMilliseconds) { }

        public TypeScriptRulesBridgeProcessClient(string repositoryRoot, int timeoutMilliseconds)
        {
            this.repositoryRoot = Path.GetFullPath(repositoryRoot ?? string.Empty);
            this.timeoutMilliseconds = timeoutMilliseconds > 0
                ? timeoutMilliseconds
                : DefaultTimeoutMilliseconds;
            PackagedRulesRuntime resolvedRuntime;
            PackagedRulesRuntime.TryResolve(out resolvedRuntime);
            packagedRuntime = resolvedRuntime;
        }

        ~TypeScriptRulesBridgeProcessClient()
        {
            StopPersistentMailboxBridge();
        }

        public JObject Execute(JObject request)
        {
            EnsureBridgeAvailable();
            if (ShouldUsePersistentMailboxBridge())
            {
                try
                {
                    return ExecuteThroughPersistentMailbox(request);
                }
                catch (Exception persistentError)
                {
                    StopPersistentMailboxBridge();
                    try
                    {
                        return ExecuteOneShotBridge(request);
                    }
                    catch (Exception fallbackError)
                    {
                        throw new InvalidOperationException(
                            "Persistent Unity TypeScript rules bridge failed: "
                                + persistentError.Message
                                + " One-shot bridge fallback also failed: "
                                + fallbackError.Message,
                            fallbackError
                        );
                    }
                }
            }

            return ExecuteOneShotBridge(request);
        }

        private JObject ExecuteOneShotBridge(JObject request)
        {
            var requestPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid() + ".json");
            var responsePath = ShouldUseResponseFile()
                ? Path.Combine(Path.GetTempPath(), Guid.NewGuid() + ".response.json")
                : string.Empty;
            try
            {
                File.WriteAllText(requestPath, request.ToString(Formatting.None));
                return ExecuteRequestFile(requestPath, responsePath);
            }
            finally
            {
                if (File.Exists(requestPath))
                {
                    File.Delete(requestPath);
                }

                if (!string.IsNullOrEmpty(responsePath) && File.Exists(responsePath))
                {
                    File.Delete(responsePath);
                }
            }
        }

        private JObject ExecuteThroughPersistentMailbox(JObject request)
        {
            EnsurePersistentMailboxBridge();
            try
            {
                return persistentMailboxClient.Execute(request);
            }
            catch
            {
                StopPersistentMailboxBridge();
                throw;
            }
        }

        private void EnsurePersistentMailboxBridge()
        {
            if (
                persistentMailboxClient != null
                && persistentMailboxProcess != null
                && !persistentMailboxProcess.HasExited
            )
            {
                return;
            }

            StopPersistentMailboxBridge();
            persistentMailboxDirectory = Path.Combine(
                Path.GetTempPath(),
                "gemduel-unity-rules-bridge-" + Guid.NewGuid().ToString("N")
            );
            Directory.CreateDirectory(Path.Combine(persistentMailboxDirectory, "requests"));
            Directory.CreateDirectory(Path.Combine(persistentMailboxDirectory, "responses"));

            var startInfo = BuildPersistentMailboxStartInfo(persistentMailboxDirectory);
            var process = new Process
            {
                StartInfo = startInfo,
                EnableRaisingEvents = true,
            };
            if (startInfo.RedirectStandardOutput)
            {
                process.OutputDataReceived += (sender, args) => { };
            }

            if (startInfo.RedirectStandardError)
            {
                process.ErrorDataReceived += (sender, args) => { };
            }

            if (!process.Start())
            {
                throw new InvalidOperationException(
                    "Unity TypeScript rules bridge mailbox process did not start: "
                    + DescribeStartInfo(startInfo)
                );
            }

            if (startInfo.RedirectStandardOutput)
            {
                process.BeginOutputReadLine();
            }

            if (startInfo.RedirectStandardError)
            {
                process.BeginErrorReadLine();
            }

            System.Threading.Thread.Sleep(50);
            if (process.HasExited)
            {
                var exitCode = process.ExitCode;
                process.Dispose();
                StopPersistentMailboxBridge();
                throw new InvalidOperationException(
                    "Unity TypeScript rules bridge mailbox process exited during startup. Exit code "
                    + exitCode
                    + ": "
                    + DescribeStartInfo(startInfo)
                );
            }

            persistentMailboxProcess = process;
            persistentMailboxClient = new TypeScriptRulesBridgeMailboxClient(
                persistentMailboxDirectory,
                timeoutMilliseconds
            );
        }

        private void StopPersistentMailboxBridge()
        {
            if (persistentMailboxProcess != null)
            {
                try
                {
                    if (!persistentMailboxProcess.HasExited)
                    {
                        persistentMailboxProcess.Kill();
                    }
                }
                catch (InvalidOperationException) { }
                catch (NotSupportedException) { }
                finally
                {
                    persistentMailboxProcess.Dispose();
                    persistentMailboxProcess = null;
                }
            }

            persistentMailboxClient = null;
            if (!string.IsNullOrEmpty(persistentMailboxDirectory))
            {
                try
                {
                    if (Directory.Exists(persistentMailboxDirectory))
                    {
                        Directory.Delete(persistentMailboxDirectory, true);
                    }
                }
                catch (IOException) { }
                catch (UnauthorizedAccessException) { }
                persistentMailboxDirectory = string.Empty;
            }
        }

        private static bool ShouldUsePersistentMailboxBridge()
        {
            var disabled = Environment.GetEnvironmentVariable(
                "GEMDUEL_RULES_BRIDGE_DISABLE_PERSISTENT"
            );
            return disabled != "1"
                && !string.Equals(disabled, "true", StringComparison.OrdinalIgnoreCase);
        }

        public bool IsAvailable(out string error)
        {
            error = string.Empty;
            if (packagedRuntime != null)
            {
                return packagedRuntime.IsAvailable(out error);
            }

            if (!Directory.Exists(repositoryRoot))
            {
                error = "Unity TypeScript rules bridge repository root does not exist: " + repositoryRoot;
                return false;
            }

            if (!File.Exists(Path.Combine(repositoryRoot, "pnpm-lock.yaml")))
            {
                error = "Unity TypeScript rules bridge repository root is missing pnpm-lock.yaml: "
                    + repositoryRoot;
                return false;
            }

            var toolsScripts = Path.Combine(repositoryRoot, "tools", "scripts");
            if (!Directory.Exists(toolsScripts))
            {
                error = "Unity TypeScript rules bridge is missing tools/scripts at: " + toolsScripts;
                return false;
            }

            var bridgeScript = Path.Combine(
                repositoryRoot,
                "tools",
                "migration",
                "unity-rules-engine-bridge.ts"
            );
            if (!File.Exists(bridgeScript))
            {
                error = "Unity TypeScript rules bridge script is missing: " + bridgeScript;
                return false;
            }

            if (!HasLocalViteNode(toolsScripts))
            {
                error = "Unity TypeScript rules bridge requires tools/scripts vite-node dependencies. "
                    + "Run pnpm install from the repository root. Missing "
                    + Path.Combine(toolsScripts, "node_modules", ".bin", ViteNodeExecutableName())
                    + ".";
                return false;
            }

            var pnpmCommand = ResolvePnpmCommand();
            if (
                Application.platform == RuntimePlatform.WindowsPlayer
                && IsExplicitPnpmPath(pnpmCommand)
                && !TryResolveNodeCommandFromPnpm(pnpmCommand, out _)
            )
            {
                error = "Unity TypeScript rules bridge built-player smoke requires node.exe beside "
                    + "GEMDUEL_PNPM_PATH so the player can launch vite-node without cmd.exe: "
                    + pnpmCommand
                    + ".";
                return false;
            }

            if (!CommandExists(pnpmCommand))
            {
                error = IsExplicitPnpmPath(pnpmCommand)
                    ? "Unity TypeScript rules bridge GEMDUEL_PNPM_PATH does not exist or is not executable: "
                        + pnpmCommand
                        + "."
                    : "Unity TypeScript rules bridge requires pnpm on PATH. "
                        + "Install pnpm 10.x, launch Unity with a PATH that includes pnpm, "
                        + "or set GEMDUEL_PNPM_PATH to pnpm.cmd.";
                return false;
            }

            return true;
        }

        private void EnsureBridgeAvailable()
        {
            if (!availabilityChecked)
            {
                availabilityChecked = true;
                if (!IsAvailable(out availabilityError))
                {
                    throw new InvalidOperationException(availabilityError);
                }
            }

            if (!string.IsNullOrEmpty(availabilityError))
            {
                throw new InvalidOperationException(availabilityError);
            }
        }

        private JObject ExecuteRequestFile(string requestPath, string responsePath)
        {
            var startInfo = BuildStartInfo(requestPath, responsePath);
            using (var process = new Process())
            {
                process.StartInfo = startInfo;
                if (!process.Start())
                {
                    throw new InvalidOperationException(
                        "Unity TypeScript rules bridge process did not start: "
                        + DescribeStartInfo(startInfo)
                    );
                }

                var stdoutTask = startInfo.RedirectStandardOutput
                    ? process.StandardOutput.ReadToEndAsync()
                    : null;
                var stderrTask = startInfo.RedirectStandardError
                    ? process.StandardError.ReadToEndAsync()
                    : null;

                if (!process.WaitForExit(timeoutMilliseconds))
                {
                    try
                    {
                        process.Kill();
                    }
                    catch (InvalidOperationException) { }

                    throw new TimeoutException(
                        "Unity TypeScript rules bridge timed out after "
                            + timeoutMilliseconds
                            + " ms while running "
                            + requestPath
                        + "."
                    );
                }

                if (!string.IsNullOrEmpty(responsePath) && File.Exists(responsePath))
                {
                    return JObject.Parse(File.ReadAllText(responsePath));
                }

                var stdout = stdoutTask?.Result ?? string.Empty;
                var stderr = stderrTask?.Result ?? string.Empty;

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

        private ProcessStartInfo BuildPersistentMailboxStartInfo(string mailboxDirectory)
        {
            if (packagedRuntime != null)
            {
                return packagedRuntime.BuildMailboxStartInfo(mailboxDirectory);
            }

            var toolsScripts = Path.Combine(repositoryRoot, "tools", "scripts");
            var bridgeScript = Path.Combine(
                repositoryRoot,
                "tools",
                "migration",
                "unity-rules-engine-bridge.ts"
            );
            var pnpmCommand = ResolvePnpmCommand();
            var viteNodeScript = Path.Combine(
                toolsScripts,
                "node_modules",
                "vite-node",
                "vite-node.mjs"
            );

            var useShellExecute = Application.platform == RuntimePlatform.WindowsPlayer;
            var startInfo = new ProcessStartInfo
            {
                WorkingDirectory = repositoryRoot,
                RedirectStandardOutput = !useShellExecute,
                RedirectStandardError = !useShellExecute,
                UseShellExecute = useShellExecute,
                CreateNoWindow = !useShellExecute,
            };
            if (useShellExecute)
            {
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;
            }

            if (
                Application.platform == RuntimePlatform.WindowsEditor
                || Application.platform == RuntimePlatform.WindowsPlayer
            )
            {
                if (
                    IsExplicitPnpmPath(pnpmCommand)
                    && TryResolveNodeCommandFromPnpm(pnpmCommand, out var nodeCommand)
                    && File.Exists(viteNodeScript)
                )
                {
                    startInfo.FileName = nodeCommand;
                    startInfo.Arguments =
                        Quote(viteNodeScript)
                        + " --script "
                        + Quote(bridgeScript)
                        + " --mailbox "
                        + Quote(mailboxDirectory);
                }
                else
                {
                    startInfo.FileName = Environment.GetEnvironmentVariable("ComSpec") ?? "cmd.exe";
                    startInfo.Arguments =
                        "/d /s /c "
                        + (
                            IsExplicitPnpmPath(pnpmCommand)
                                ? "call " + Quote(pnpmCommand)
                                : pnpmCommand
                        )
                        + " --dir "
                        + Quote(toolsScripts)
                        + " exec vite-node --script "
                        + Quote(bridgeScript)
                        + " --mailbox "
                        + Quote(mailboxDirectory);
                }
            }
            else
            {
                startInfo.FileName = pnpmCommand;
                startInfo.Arguments =
                    "--dir "
                    + Quote(toolsScripts)
                    + " exec vite-node --script "
                    + Quote(bridgeScript)
                    + " --mailbox "
                    + Quote(mailboxDirectory);
            }

            return startInfo;
        }

        private ProcessStartInfo BuildStartInfo(string requestPath, string responsePath)
        {
            if (packagedRuntime != null)
            {
                return packagedRuntime.BuildRequestStartInfo(requestPath, responsePath);
            }

            var toolsScripts = Path.Combine(repositoryRoot, "tools", "scripts");
            var bridgeScript = Path.Combine(
                repositoryRoot,
                "tools",
                "migration",
                "unity-rules-engine-bridge.ts"
            );
            var pnpmCommand = ResolvePnpmCommand();
            var useResponseFile = !string.IsNullOrEmpty(responsePath);
            var viteNodeScript = Path.Combine(
                toolsScripts,
                "node_modules",
                "vite-node",
                "vite-node.mjs"
            );

            var startInfo = new ProcessStartInfo
            {
                WorkingDirectory = repositoryRoot,
                RedirectStandardOutput = !useResponseFile,
                RedirectStandardError = !useResponseFile,
                UseShellExecute = useResponseFile,
                CreateNoWindow = !useResponseFile,
            };
            if (useResponseFile)
            {
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;
            }

            if (
                Application.platform == RuntimePlatform.WindowsEditor
                || Application.platform == RuntimePlatform.WindowsPlayer
            )
            {
                if (
                    IsExplicitPnpmPath(pnpmCommand)
                    && TryResolveNodeCommandFromPnpm(pnpmCommand, out var nodeCommand)
                    && File.Exists(viteNodeScript)
                )
                {
                    startInfo.FileName = nodeCommand;
                    startInfo.Arguments =
                        Quote(viteNodeScript)
                        + " --script "
                        + Quote(bridgeScript)
                        + " "
                        + Quote(requestPath)
                        + ResponseFileArgument(responsePath);
                }
                else
                {
                    startInfo.FileName = Environment.GetEnvironmentVariable("ComSpec") ?? "cmd.exe";
                    startInfo.Arguments =
                        "/d /s /c "
                        + (
                            IsExplicitPnpmPath(pnpmCommand)
                                ? "call " + Quote(pnpmCommand)
                                : pnpmCommand
                        )
                        + " --dir "
                        + Quote(toolsScripts)
                        + " exec vite-node --script "
                        + Quote(bridgeScript)
                        + " "
                        + Quote(requestPath)
                        + ResponseFileArgument(responsePath);
                }
            }
            else
            {
                startInfo.FileName = pnpmCommand;
                startInfo.Arguments =
                    "--dir "
                    + Quote(toolsScripts)
                    + " exec vite-node --script "
                    + Quote(bridgeScript)
                    + " "
                    + Quote(requestPath)
                    + ResponseFileArgument(responsePath);
            }

            return startInfo;
        }

        private static bool ShouldUseResponseFile()
        {
            return Application.platform == RuntimePlatform.WindowsPlayer;
        }

        private static string ResolveRepositoryRoot()
        {
            var configured = Environment.GetEnvironmentVariable("GEMDUEL_REPOSITORY_ROOT");
            if (!string.IsNullOrWhiteSpace(configured))
            {
                return Path.GetFullPath(configured);
            }

            var current = Path.GetFullPath(Application.dataPath);
            while (!string.IsNullOrEmpty(current))
            {
                if (
                    File.Exists(Path.Combine(current, "pnpm-lock.yaml"))
                    && File.Exists(Path.Combine(current, "tools", "migration", "unity-rules-engine-bridge.ts"))
                )
                {
                    return current;
                }

                var parent = Directory.GetParent(current);
                if (parent == null)
                {
                    break;
                }

                current = parent.FullName;
            }

            return Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
        }

        private static bool HasLocalViteNode(string toolsScripts)
        {
            var executable = Path.Combine(
                toolsScripts,
                "node_modules",
                ".bin",
                ViteNodeExecutableName()
            );
            return File.Exists(executable);
        }

        private static string ViteNodeExecutableName()
        {
            return Application.platform == RuntimePlatform.WindowsEditor
                || Application.platform == RuntimePlatform.WindowsPlayer
                ? "vite-node.cmd"
                : "vite-node";
        }

        private static bool CommandExists(string command)
        {
            if (IsExplicitPnpmPath(command))
            {
                return File.Exists(command);
            }

            var isWindows =
                Application.platform == RuntimePlatform.WindowsEditor
                || Application.platform == RuntimePlatform.WindowsPlayer;
            var startInfo = isWindows
                ? new ProcessStartInfo
                {
                    FileName = Environment.GetEnvironmentVariable("ComSpec") ?? "cmd.exe",
                    Arguments = "/d /s /c \"where " + command + "\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                }
                : new ProcessStartInfo
                {
                    FileName = "which",
                    Arguments = command,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                };

            try
            {
                using (var process = Process.Start(startInfo))
                {
                    if (process == null)
                    {
                        return false;
                    }

                    if (!process.WaitForExit(3000))
                    {
                        try
                        {
                            process.Kill();
                        }
                        catch (InvalidOperationException) { }

                        return false;
                    }

                    return process.ExitCode == 0;
                }
            }
            catch
            {
                return false;
            }
        }

        private static string ResolvePnpmCommand()
        {
            var configured = Environment.GetEnvironmentVariable("GEMDUEL_PNPM_PATH");
            if (!string.IsNullOrWhiteSpace(configured))
            {
                return Path.GetFullPath(configured);
            }

            return "pnpm";
        }

        private static bool TryResolveNodeCommandFromPnpm(string pnpmCommand, out string nodeCommand)
        {
            nodeCommand = string.Empty;
            if (!IsExplicitPnpmPath(pnpmCommand))
            {
                return false;
            }

            var directory = Path.GetDirectoryName(pnpmCommand);
            if (string.IsNullOrEmpty(directory))
            {
                return false;
            }

            var nodePath = Path.Combine(directory, "node.exe");
            if (!File.Exists(nodePath))
            {
                return false;
            }

            nodeCommand = nodePath;
            return true;
        }

        private static bool IsExplicitPnpmPath(string command)
        {
            return Path.IsPathRooted(command)
                || command.IndexOf(Path.DirectorySeparatorChar) >= 0
                || command.IndexOf(Path.AltDirectorySeparatorChar) >= 0;
        }

        private static string Quote(string value)
        {
            return "\"" + value.Replace("\"", "\\\"") + "\"";
        }

        private static string ResponseFileArgument(string responsePath)
        {
            return string.IsNullOrEmpty(responsePath) ? string.Empty : " --out " + Quote(responsePath);
        }

        private static string DescribeStartInfo(ProcessStartInfo startInfo)
        {
            return "ApplicationName='"
                + startInfo.FileName
                + "', CommandLine='"
                + startInfo.Arguments
                + "', CurrentDirectory='"
                + startInfo.WorkingDirectory
                + "'";
        }
    }
}
