using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using GemDuel.Core;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GemDuel.Lan
{
    public enum LanRole
    {
        Host,
        Client
    }

    public enum LanConnectionStatus
    {
        Disconnected,
        Listening,
        Connecting,
        Connected,
        Closed,
        Error
    }

    public static class LanMessageTypes
    {
        public const string HelloVersion = "hello/version";
        public const string HostSnapshot = "host_snapshot";
        public const string ClientCommand = "client_command";
        public const string CommandResult = "command_result";
        public const string ReplayEvent = "replay_event";
        public const string StateHash = "state_hash";
        public const string ResyncRequest = "resync_request";
        public const string ResyncSnapshot = "resync_snapshot";
        public const string Disconnect = "disconnect";
        public const string Reconnect = "reconnect";
    }

    public sealed class LanMessage
    {
        public const int CurrentLanProtocolVersion = 1;
        public const int SharedNetworkProtocolVersion = 3;

        public int LanProtocolVersion { get; set; } = CurrentLanProtocolVersion;
        public int NetworkProtocolVersion { get; set; } = SharedNetworkProtocolVersion;
        public string SessionId { get; set; } = string.Empty;
        public string MessageId { get; set; } = string.Empty;
        public string SenderInstanceId { get; set; } = string.Empty;
        public string SenderPlayer { get; set; } = string.Empty;
        public string SenderRole { get; set; } = string.Empty;
        public long SentAtMs { get; set; }
        public string Type { get; set; } = string.Empty;
        public int ReplayRevision { get; set; }
        public string StateHash { get; set; } = string.Empty;
        public JObject Payload { get; set; } = new JObject();

        public static LanMessage Create(
            string sessionId,
            string senderInstanceId,
            string senderPlayer,
            LanRole senderRole,
            string type,
            int replayRevision,
            string stateHash,
            JObject payload,
            int sequence
        )
        {
            return new LanMessage
            {
                SessionId = sessionId ?? string.Empty,
                MessageId = sequence.ToString(CultureInfo.InvariantCulture),
                SenderInstanceId = senderInstanceId ?? string.Empty,
                SenderPlayer = senderPlayer ?? string.Empty,
                SenderRole = senderRole == LanRole.Host ? "host" : "client",
                SentAtMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Type = type ?? string.Empty,
                ReplayRevision = replayRevision,
                StateHash = stateHash ?? string.Empty,
                Payload = payload == null ? new JObject() : (JObject)payload.DeepClone(),
            };
        }

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.None);
        }

        public static LanMessage FromJson(string json)
        {
            return JsonConvert.DeserializeObject<LanMessage>(json);
        }

        public LanMessage Clone()
        {
            return FromJson(ToJson());
        }
    }

    public sealed class LanMessageReceivedEventArgs : EventArgs
    {
        public LanMessageReceivedEventArgs(LanMessage message)
        {
            Message = message;
        }

        public LanMessage Message { get; private set; }
    }

    public sealed class LanStatusChangedEventArgs : EventArgs
    {
        public LanStatusChangedEventArgs(LanConnectionStatus status, string detail)
        {
            Status = status;
            Detail = detail ?? string.Empty;
        }

        public LanConnectionStatus Status { get; private set; }
        public string Detail { get; private set; }
    }

    public sealed class LanSnapshotEventArgs : EventArgs
    {
        public LanSnapshotEventArgs(
            string viewerPlayer,
            JObject snapshot,
            int replayRevision,
            string stateHash,
            string reason
        )
        {
            ViewerPlayer = viewerPlayer ?? string.Empty;
            Snapshot = snapshot == null ? new JObject() : (JObject)snapshot.DeepClone();
            ReplayRevision = replayRevision;
            StateHash = stateHash ?? string.Empty;
            Reason = reason ?? string.Empty;
        }

        public string ViewerPlayer { get; private set; }
        public JObject Snapshot { get; private set; }
        public int ReplayRevision { get; private set; }
        public string StateHash { get; private set; }
        public string Reason { get; private set; }
    }

    public sealed class LanCommandResultEventArgs : EventArgs
    {
        public LanCommandResultEventArgs(
            string requestId,
            string intentKind,
            bool accepted,
            int replayRevision,
            string stateHash,
            string reasonCode,
            string reason
        )
        {
            RequestId = requestId ?? string.Empty;
            IntentKind = intentKind ?? string.Empty;
            Accepted = accepted;
            ReplayRevision = replayRevision;
            StateHash = stateHash ?? string.Empty;
            ReasonCode = reasonCode ?? string.Empty;
            Reason = reason ?? string.Empty;
        }

        public string RequestId { get; private set; }
        public string IntentKind { get; private set; }
        public bool Accepted { get; private set; }
        public int ReplayRevision { get; private set; }
        public string StateHash { get; private set; }
        public string ReasonCode { get; private set; }
        public string Reason { get; private set; }
    }

    public interface ILanTransport : IDisposable
    {
        event EventHandler<LanMessageReceivedEventArgs> MessageReceived;
        event EventHandler<LanStatusChangedEventArgs> StatusChanged;

        LanConnectionStatus Status { get; }
        string LocalEndpoint { get; }
        string RemoteEndpoint { get; }

        void StartHost(int port);
        void Join(string host, int port);
        void Send(LanMessage message);
        void Close();
    }

    public interface ILanSession : IDisposable
    {
        event EventHandler<LanSnapshotEventArgs> SnapshotReceived;
        event EventHandler<LanCommandResultEventArgs> CommandResultReceived;
        event EventHandler<LanStatusChangedEventArgs> StatusChanged;

        LanRole Role { get; }
        string LocalPlayer { get; }
        string RemotePlayer { get; }
        string SessionId { get; }
        LanConnectionStatus Status { get; }
        int ReplayRevision { get; }
        string StateHash { get; }
        JObject CurrentSnapshot { get; }

        bool SendCommand(string commandType, JObject payload, out string error);
        void RequestResync(string reason);
        void Close();
    }

    public sealed class LoopbackLanTransport : ILanTransport
    {
        private LoopbackLanTransport peer;
        private LanConnectionStatus status = LanConnectionStatus.Disconnected;
        private readonly List<LanMessage> sentMessages = new List<LanMessage>();

        public event EventHandler<LanMessageReceivedEventArgs> MessageReceived;
        public event EventHandler<LanStatusChangedEventArgs> StatusChanged;

        public LanConnectionStatus Status
        {
            get { return status; }
        }

        public string LocalEndpoint { get; private set; } = "loopback";
        public string RemoteEndpoint { get; private set; } = "loopback";
        public IReadOnlyList<LanMessage> SentMessages
        {
            get { return sentMessages; }
        }

        public static void CreatePair(out LoopbackLanTransport host, out LoopbackLanTransport client)
        {
            host = new LoopbackLanTransport();
            client = new LoopbackLanTransport();
            host.peer = client;
            client.peer = host;
        }

        public void StartHost(int port)
        {
            LocalEndpoint = "loopback-host:" + port.ToString(CultureInfo.InvariantCulture);
            SetStatus(LanConnectionStatus.Connected, "Loopback host connected.");
        }

        public void Join(string host, int port)
        {
            LocalEndpoint = "loopback-client";
            RemoteEndpoint = (host ?? "loopback-host") + ":" + port.ToString(CultureInfo.InvariantCulture);
            SetStatus(LanConnectionStatus.Connected, "Loopback client connected.");
        }

        public void Send(LanMessage message)
        {
            if (status == LanConnectionStatus.Closed)
            {
                throw new InvalidOperationException("Loopback transport is closed.");
            }

            if (peer == null)
            {
                throw new InvalidOperationException("Loopback peer is not paired.");
            }

            sentMessages.Add(message.Clone());
            peer.Receive(message.Clone());
        }

        public void Close()
        {
            SetStatus(LanConnectionStatus.Closed, "Loopback transport closed.");
        }

        public void Dispose()
        {
            Close();
        }

        private void Receive(LanMessage message)
        {
            MessageReceived?.Invoke(this, new LanMessageReceivedEventArgs(message));
        }

        private void SetStatus(LanConnectionStatus nextStatus, string detail)
        {
            status = nextStatus;
            StatusChanged?.Invoke(this, new LanStatusChangedEventArgs(status, detail));
        }
    }

    public sealed class TcpLanTransport : ILanTransport
    {
        private readonly object sendLock = new object();
        private TcpListener listener;
        private TcpClient client;
        private StreamReader reader;
        private StreamWriter writer;
        private Thread acceptThread;
        private Thread receiveThread;
        private volatile bool closed;
        private LanConnectionStatus status = LanConnectionStatus.Disconnected;

        public event EventHandler<LanMessageReceivedEventArgs> MessageReceived;
        public event EventHandler<LanStatusChangedEventArgs> StatusChanged;

        public LanConnectionStatus Status
        {
            get { return status; }
        }

        public string LocalEndpoint { get; private set; } = string.Empty;
        public string RemoteEndpoint { get; private set; } = string.Empty;

        public void StartHost(int port)
        {
            CloseSocketOnly();
            closed = false;
            listener = new TcpListener(IPAddress.Any, port);
            listener.Start();
            LocalEndpoint = "0.0.0.0:" + port.ToString(CultureInfo.InvariantCulture);
            SetStatus(LanConnectionStatus.Listening, "LAN host listening on " + LocalEndpoint + ".");
            acceptThread = new Thread(AcceptLoop);
            acceptThread.IsBackground = true;
            acceptThread.Start();
        }

        public void Join(string host, int port)
        {
            CloseSocketOnly();
            closed = false;
            SetStatus(LanConnectionStatus.Connecting, "Connecting to " + host + ":" + port.ToString(CultureInfo.InvariantCulture) + ".");
            client = new TcpClient();
            client.Connect(host, port);
            AttachClient(client);
            SetStatus(LanConnectionStatus.Connected, "Connected to LAN host.");
        }

        public void Send(LanMessage message)
        {
            lock (sendLock)
            {
                if (writer == null)
                {
                    throw new InvalidOperationException("LAN transport has no active connection.");
                }

                writer.WriteLine(message.ToJson());
                writer.Flush();
            }
        }

        public void Close()
        {
            closed = true;
            CloseSocketOnly();
            SetStatus(LanConnectionStatus.Closed, "LAN transport closed.");
        }

        public void Dispose()
        {
            Close();
        }

        private void AcceptLoop()
        {
            try
            {
                var accepted = listener.AcceptTcpClient();
                if (closed)
                {
                    accepted.Close();
                    return;
                }

                AttachClient(accepted);
                SetStatus(LanConnectionStatus.Connected, "LAN client connected.");
            }
            catch (Exception ex)
            {
                if (!closed)
                {
                    SetStatus(LanConnectionStatus.Error, ex.Message);
                }
            }
        }

        private void AttachClient(TcpClient nextClient)
        {
            client = nextClient;
            LocalEndpoint = client.Client.LocalEndPoint == null ? string.Empty : client.Client.LocalEndPoint.ToString();
            RemoteEndpoint = client.Client.RemoteEndPoint == null ? string.Empty : client.Client.RemoteEndPoint.ToString();
            var stream = client.GetStream();
            reader = new StreamReader(stream, Encoding.UTF8);
            writer = new StreamWriter(stream, new UTF8Encoding(false));
            receiveThread = new Thread(ReceiveLoop);
            receiveThread.IsBackground = true;
            receiveThread.Start();
        }

        private void ReceiveLoop()
        {
            try
            {
                while (!closed)
                {
                    var line = reader.ReadLine();
                    if (line == null)
                    {
                        break;
                    }

                    var message = LanMessage.FromJson(line);
                    if (message != null)
                    {
                        MessageReceived?.Invoke(this, new LanMessageReceivedEventArgs(message));
                    }
                }

                if (!closed)
                {
                    SetStatus(LanConnectionStatus.Closed, "LAN connection closed by peer.");
                }
            }
            catch (Exception ex)
            {
                if (!closed)
                {
                    SetStatus(LanConnectionStatus.Error, ex.Message);
                }
            }
        }

        private void CloseSocketOnly()
        {
            try
            {
                listener?.Stop();
            }
            catch
            {
            }

            try
            {
                client?.Close();
            }
            catch
            {
            }

            listener = null;
            client = null;
            reader = null;
            writer = null;
        }

        private void SetStatus(LanConnectionStatus nextStatus, string detail)
        {
            status = nextStatus;
            StatusChanged?.Invoke(this, new LanStatusChangedEventArgs(status, detail));
        }
    }

    public static class LanVisibilityFilter
    {
        public static JObject CreateViewForPlayer(JObject authoritativeSnapshot, string viewerPlayer)
        {
            var view = authoritativeSnapshot == null ? new JObject() : (JObject)authoritativeSnapshot.DeepClone();
            var viewer = NormalizePlayer(viewerPlayer, "p1");
            var opponent = Opponent(viewer);
            var hostPlayer = NormalizePlayer(view.Value<string>("hostPlayer"), "p1");

            view["localPlayer"] = viewer;
            view["isHost"] = viewer == hostPlayer;
            view["hostPlayer"] = hostPlayer;

            var reservedByPlayer = view["playerReserved"] as JObject;
            var opponentReserved = reservedByPlayer == null ? null : reservedByPlayer[opponent] as JArray;
            if (opponentReserved != null)
            {
                var redacted = new JArray();
                for (var slotIndex = 0; slotIndex < opponentReserved.Count; slotIndex += 1)
                {
                    redacted.Add(CreateHiddenReservedPlaceholder(opponent, slotIndex));
                }

                reservedByPlayer[opponent] = redacted;
            }

            return view;
        }

        public static JObject CreateHiddenReservedPlaceholder(string owner, int slotIndex)
        {
            return new JObject
            {
                ["isHiddenReservedCard"] = true,
                ["slotKey"] = "reserved-back-" + owner + "-" + slotIndex.ToString(CultureInfo.InvariantCulture),
                ["owner"] = owner,
                ["slotIndex"] = slotIndex,
            };
        }

        public static bool IsHiddenReservedCard(JToken value)
        {
            return value is JObject obj && obj.Value<bool?>("isHiddenReservedCard") == true;
        }

        public static string Opponent(string player)
        {
            return player == "p2" ? "p1" : "p2";
        }

        public static string NormalizePlayer(string player, string fallback)
        {
            return player == "p1" || player == "p2" ? player : fallback;
        }
    }

    public sealed class LanHostSession : ILanSession
    {
        private static readonly HashSet<string> AllowedGuestCommandTypes = new HashSet<string>(
            StringComparer.Ordinal
            )
        {
            "SELECT_BUFF",
            "TAKE_GEMS",
            "REPLENISH",
            "TAKE_BONUS_GEM",
            "DISCARD_GEM",
            "STEAL_GEM",
            "INITIATE_BUY_JOKER",
            "BUY_CARD",
            "INITIATE_RESERVE",
            "INITIATE_RESERVE_DECK",
            "CANCEL_RESERVE",
            "RESERVE_CARD",
            "RESERVE_DECK",
            "DISCARD_RESERVED",
            "ACTIVATE_PRIVILEGE",
            "USE_PRIVILEGE",
            "CANCEL_PRIVILEGE",
            "SELECT_ROYAL_CARD",
            "PEEK_DECK",
            "CLOSE_MODAL",
        };

        private readonly ILanTransport transport;
        private readonly IGameRulesEngine rulesEngine;
        private readonly ReplayStateHasher hasher = new ReplayStateHasher();
        private readonly string instanceId;
        private readonly string seed;
        private readonly bool useBuffs;
        private int messageSequence;
        private GameState authoritativeState;
        private JObject currentInit = new JObject();
        private bool started;

        public LanHostSession(
            ILanTransport transport,
            IGameRulesEngine rulesEngine,
            string sessionId,
            string seed,
            string hostPlayer = "p1",
            bool useBuffs = false
        )
        {
            this.transport = transport ?? throw new ArgumentNullException(nameof(transport));
            this.rulesEngine = rulesEngine ?? throw new ArgumentNullException(nameof(rulesEngine));
            SessionId = string.IsNullOrWhiteSpace(sessionId) ? Guid.NewGuid().ToString("N") : sessionId;
            LocalPlayer = LanVisibilityFilter.NormalizePlayer(hostPlayer, "p1");
            RemotePlayer = LanVisibilityFilter.Opponent(LocalPlayer);
            this.seed = string.IsNullOrWhiteSpace(seed) ? "unity-lan" : seed;
            this.useBuffs = useBuffs;
            instanceId = "unity-lan-host-" + Guid.NewGuid().ToString("N");
            transport.MessageReceived += OnMessageReceived;
            transport.StatusChanged += OnTransportStatusChanged;
        }

        public event EventHandler<LanSnapshotEventArgs> SnapshotReceived;
        public event EventHandler<LanCommandResultEventArgs> CommandResultReceived;
        public event EventHandler<LanStatusChangedEventArgs> StatusChanged;

        public LanRole Role
        {
            get { return LanRole.Host; }
        }

        public string LocalPlayer { get; private set; }
        public string RemotePlayer { get; private set; }
        public string SessionId { get; private set; }

        public LanConnectionStatus Status
        {
            get { return transport.Status; }
        }

        public int ReplayRevision { get; private set; }
        public string StateHash { get; private set; } = string.Empty;
        public JObject CurrentSnapshot { get; private set; } = new JObject();
        public JObject CurrentInit
        {
            get { return (JObject)currentInit.DeepClone(); }
        }

        public GameState AuthoritativeState
        {
            get { return authoritativeState; }
        }

        public bool StartGame(out string error)
        {
            error = string.Empty;
            var result = rulesEngine.StartNetworkGame(seed, LocalPlayer, useBuffs);
            if (!result.Ok || result.State == null)
            {
                error = string.IsNullOrEmpty(result.Error) ? "LAN host rules bridge failed to start." : result.Error;
                StatusChanged?.Invoke(this, new LanStatusChangedEventArgs(LanConnectionStatus.Error, error));
                return false;
            }

            currentInit = result.Init == null ? new JObject() : (JObject)result.Init.DeepClone();
            ApplyAuthoritativeResult(result, true);
            started = true;
            SendHello();
            SendSnapshot(RemotePlayer, LanMessageTypes.HostSnapshot, "initial");
            RaiseLocalSnapshot("initial");
            return true;
        }

        public void StartHost(int port)
        {
            transport.StartHost(port);
        }

        public bool SendCommand(string commandType, JObject payload, out string error)
        {
            var result = ApplyHostCommand(commandType, payload, LocalPlayer, out error);
            return result != null && result.Accepted;
        }

        public LanCommandResultEventArgs ApplyHostCommand(
            string commandType,
            JObject payload,
            string actor,
            out string error
        )
        {
            error = string.Empty;
            var requestId = "host-" + NextSequence().ToString(CultureInfo.InvariantCulture);
            var result = TryApplyCommand(requestId, commandType, payload, actor, ReplayRevision, StateHash);
            CommandResultReceived?.Invoke(this, result);
            if (!result.Accepted)
            {
                error = result.Reason;
                return result;
            }

            SendReplayProof(result.IntentKind, requestId);
            SendSnapshot(RemotePlayer, LanMessageTypes.HostSnapshot, "host_command");
            RaiseLocalSnapshot("host_command");
            return result;
        }

        public void RequestResync(string reason)
        {
            SendSnapshot(RemotePlayer, LanMessageTypes.ResyncSnapshot, reason ?? "HOST_REQUEST");
        }

        public void Close()
        {
            SendLifecycleMessage(LanMessageTypes.Disconnect, "HOST_CLOSED");
            transport.Close();
        }

        public void Dispose()
        {
            Close();
        }

        private void OnTransportStatusChanged(object sender, LanStatusChangedEventArgs args)
        {
            StatusChanged?.Invoke(this, args);
            if (args.Status == LanConnectionStatus.Connected && started)
            {
                SendHello();
                SendSnapshot(RemotePlayer, LanMessageTypes.HostSnapshot, "initial");
            }
        }

        private void OnMessageReceived(object sender, LanMessageReceivedEventArgs args)
        {
            var message = args.Message;
            if (!IsCompatible(message))
            {
                SendRejectedResult(
                    string.Empty,
                    string.Empty,
                    "PROTOCOL_VERSION_MISMATCH",
                    "LAN or shared network protocol version mismatch."
                );
                return;
            }

            switch (message.Type)
            {
                case LanMessageTypes.HelloVersion:
                    if (started)
                    {
                        SendHello();
                        SendSnapshot(RemotePlayer, LanMessageTypes.HostSnapshot, "initial");
                    }
                    break;
                case LanMessageTypes.ClientCommand:
                    HandleClientCommand(message);
                    break;
                case LanMessageTypes.ResyncRequest:
                    SendSnapshot(RemotePlayer, LanMessageTypes.ResyncSnapshot, message.Payload.Value<string>("reason") ?? "CLIENT_REQUEST");
                    break;
                case LanMessageTypes.Reconnect:
                    SendSnapshot(RemotePlayer, LanMessageTypes.ResyncSnapshot, "RECONNECT");
                    break;
            }
        }

        private void HandleClientCommand(LanMessage message)
        {
            var payload = message.Payload ?? new JObject();
            var requestId = payload.Value<string>("requestId") ?? message.MessageId;
            var actor = LanVisibilityFilter.NormalizePlayer(payload.Value<string>("actor"), string.Empty);
            var command = payload["command"] as JObject;
            var commandType = command == null
                ? string.Empty
                : (command.Value<string>("type") ?? command.Value<string>("kind") ?? string.Empty);
            var commandPayload = command == null ? new JObject() : command["payload"] as JObject ?? new JObject();
            var baseReplayRevision = payload.Value<int?>("baseReplayRevision") ?? message.ReplayRevision;
            var baseStateHash = payload.Value<string>("baseStateHash") ?? message.StateHash ?? string.Empty;

            var result = actor == RemotePlayer
                ? TryApplyCommand(requestId, commandType, commandPayload, actor, baseReplayRevision, baseStateHash)
                : BuildResult(
                    requestId,
                    commandType,
                    false,
                    "INVALID_ACTOR",
                    "Client command actor must match the remote player assigned to this LAN session."
                );
            CommandResultReceived?.Invoke(this, result);
            SendCommandResult(result);
            if (result.Accepted)
            {
                SendReplayProof(commandType, requestId);
                SendSnapshot(RemotePlayer, LanMessageTypes.HostSnapshot, "command_result");
                RaiseLocalSnapshot("command_result");
            }
            else if (result.ReasonCode == "STATE_HASH_MISMATCH" || result.ReasonCode == "REPLAY_REVISION_MISMATCH")
            {
                SendSnapshot(RemotePlayer, LanMessageTypes.ResyncSnapshot, result.ReasonCode);
            }
        }

        private LanCommandResultEventArgs TryApplyCommand(
            string requestId,
            string commandType,
            JObject payload,
            string actor,
            int baseReplayRevision,
            string baseStateHash
        )
        {
            if (authoritativeState == null)
            {
                return BuildResult(requestId, commandType, false, "HOST_NOT_READY", "LAN host has no authoritative state.");
            }

            if (actor != RemotePlayer && actor != LocalPlayer)
            {
                return BuildResult(requestId, commandType, false, "INVALID_ACTOR", "Command actor is not assigned to this LAN session.");
            }

            if (actor != authoritativeState.Turn)
            {
                return BuildResult(requestId, commandType, false, "WRONG_TURN", "Command actor does not match the active turn.");
            }

            if (actor == RemotePlayer && !AllowedGuestCommandTypes.Contains(commandType))
            {
                return BuildResult(requestId, commandType, false, "COMMAND_NOT_ALLOWED", "Command is not allowed as a guest intent.");
            }

            if (baseReplayRevision != ReplayRevision)
            {
                return BuildResult(requestId, commandType, false, "REPLAY_REVISION_MISMATCH", "Client replay revision is stale.");
            }

            if (!string.IsNullOrEmpty(baseStateHash) && !string.IsNullOrEmpty(StateHash) && baseStateHash != StateHash)
            {
                return BuildResult(requestId, commandType, false, "STATE_HASH_MISMATCH", "Client state hash differs from host.");
            }

            var previousRevision = ReplayRevision;
            var applyResult = rulesEngine.ApplyCommand(
                authoritativeState,
                new GameRulesCommand
                {
                    Type = commandType,
                    Actor = actor,
                    Payload = payload ?? new JObject(),
                }
            );

            if (!applyResult.Ok || applyResult.State == null)
            {
                var reasonCode = string.IsNullOrEmpty(applyResult.ErrorCode) ? "RULES_REJECTED" : applyResult.ErrorCode;
                var reason = string.IsNullOrEmpty(applyResult.Error) ? "Rules bridge rejected the LAN command." : applyResult.Error;
                return BuildResult(requestId, commandType, false, reasonCode, reason);
            }

            ApplyAuthoritativeResult(applyResult, false, previousRevision + 1);
            return BuildResult(requestId, commandType, true, string.Empty, string.Empty);
        }

        private void ApplyAuthoritativeResult(GameRulesResult result, bool allowZeroRevision, int minimumRevision = 0)
        {
            var revision = result.ReplayRevision;
            if (!allowZeroRevision && revision < minimumRevision)
            {
                revision = minimumRevision;
            }

            ReplayRevision = revision;
            authoritativeState = new GameState(result.State, ReplayRevision);
            StateHash = string.IsNullOrEmpty(result.StateHash)
                ? hasher.Hash(authoritativeState)
                : result.StateHash;
            if (result.Init != null && result.Init.Count > 0)
            {
                currentInit = (JObject)result.Init.DeepClone();
            }

            CurrentSnapshot = LanVisibilityFilter.CreateViewForPlayer(authoritativeState.Snapshot, LocalPlayer);
        }

        private LanCommandResultEventArgs BuildResult(
            string requestId,
            string intentKind,
            bool accepted,
            string reasonCode,
            string reason
        )
        {
            return new LanCommandResultEventArgs(
                requestId,
                intentKind,
                accepted,
                ReplayRevision,
                StateHash,
                reasonCode,
                reason
            );
        }

        private LanCommandResultEventArgs SendRejectedResult(
            string requestId,
            string intentKind,
            string reasonCode,
            string reason
        )
        {
            var result = BuildResult(requestId, intentKind, false, reasonCode, reason);
            SendCommandResult(result);
            return result;
        }

        private void SendCommandResult(LanCommandResultEventArgs result)
        {
            Send(
                LanMessageTypes.CommandResult,
                new JObject
                {
                    ["requestId"] = result.RequestId,
                    ["intentKind"] = result.IntentKind,
                    ["accepted"] = result.Accepted,
                    ["replayRevision"] = result.ReplayRevision,
                    ["stateHash"] = result.StateHash,
                    ["reasonCode"] = string.IsNullOrEmpty(result.ReasonCode) ? null : result.ReasonCode,
                    ["reason"] = string.IsNullOrEmpty(result.Reason) ? null : result.Reason,
                }
            );
        }

        private void SendReplayProof(string intentKind, string requestId)
        {
            Send(
                LanMessageTypes.ReplayEvent,
                new JObject
                {
                    ["requestId"] = requestId,
                    ["intentKind"] = intentKind,
                    ["toRevision"] = ReplayRevision,
                    ["stateHashAfter"] = StateHash,
                }
            );
            Send(
                LanMessageTypes.StateHash,
                new JObject
                {
                    ["replayRevision"] = ReplayRevision,
                    ["stateHash"] = StateHash,
                    ["reason"] = "COMMAND_COMMITTED",
                }
            );
        }

        private void SendSnapshot(string viewerPlayer, string messageType, string reason)
        {
            if (authoritativeState == null)
            {
                return;
            }

            var snapshot = LanVisibilityFilter.CreateViewForPlayer(authoritativeState.Snapshot, viewerPlayer);
            Send(
                messageType,
                new JObject
                {
                    ["viewerPlayer"] = viewerPlayer,
                    ["snapshot"] = snapshot,
                    ["replayRevision"] = ReplayRevision,
                    ["stateHash"] = StateHash,
                    ["reason"] = reason ?? string.Empty,
                }
            );
        }

        private void RaiseLocalSnapshot(string reason)
        {
            SnapshotReceived?.Invoke(
                this,
                new LanSnapshotEventArgs(LocalPlayer, CurrentSnapshot, ReplayRevision, StateHash, reason)
            );
        }

        private void SendHello()
        {
            Send(
                LanMessageTypes.HelloVersion,
                new JObject
                {
                    ["lanProtocolVersion"] = LanMessage.CurrentLanProtocolVersion,
                    ["networkProtocolVersion"] = LanMessage.SharedNetworkProtocolVersion,
                    ["appVersion"] = "unity-local-lan",
                    ["unityBuildVersion"] = "6000.4.6f1",
                    ["instanceId"] = instanceId,
                    ["supportedTransports"] = new JArray("loopback", "tcp"),
                    ["hostPlayer"] = LocalPlayer,
                    ["clientPlayer"] = RemotePlayer,
                }
            );
        }

        private void SendLifecycleMessage(string type, string reason)
        {
            Send(
                type,
                new JObject
                {
                    ["sessionId"] = SessionId,
                    ["player"] = LocalPlayer,
                    ["lastReplayRevision"] = ReplayRevision,
                    ["lastStateHash"] = StateHash,
                    ["reason"] = reason,
                }
            );
        }

        private void Send(string type, JObject payload)
        {
            if (transport.Status != LanConnectionStatus.Connected)
            {
                return;
            }

            var message = LanMessage.Create(
                SessionId,
                instanceId,
                LocalPlayer,
                LanRole.Host,
                type,
                ReplayRevision,
                StateHash,
                payload,
                NextSequence()
            );
            transport.Send(message);
        }

        private int NextSequence()
        {
            messageSequence += 1;
            return messageSequence;
        }

        private static bool IsCompatible(LanMessage message)
        {
            return message != null
                && message.LanProtocolVersion == LanMessage.CurrentLanProtocolVersion
                && message.NetworkProtocolVersion == LanMessage.SharedNetworkProtocolVersion;
        }
    }

    public sealed class LanClientSession : ILanSession
    {
        private readonly ILanTransport transport;
        private readonly string instanceId;
        private int messageSequence;
        private string pendingRequestId = string.Empty;

        public LanClientSession(
            ILanTransport transport,
            string sessionId,
            string localPlayer = "p2",
            string hostPlayer = "p1"
        )
        {
            this.transport = transport ?? throw new ArgumentNullException(nameof(transport));
            SessionId = string.IsNullOrWhiteSpace(sessionId) ? Guid.NewGuid().ToString("N") : sessionId;
            LocalPlayer = LanVisibilityFilter.NormalizePlayer(localPlayer, "p2");
            RemotePlayer = LanVisibilityFilter.NormalizePlayer(hostPlayer, LanVisibilityFilter.Opponent(LocalPlayer));
            instanceId = "unity-lan-client-" + Guid.NewGuid().ToString("N");
            transport.MessageReceived += OnMessageReceived;
            transport.StatusChanged += OnTransportStatusChanged;
        }

        public event EventHandler<LanSnapshotEventArgs> SnapshotReceived;
        public event EventHandler<LanCommandResultEventArgs> CommandResultReceived;
        public event EventHandler<LanStatusChangedEventArgs> StatusChanged;

        public LanRole Role
        {
            get { return LanRole.Client; }
        }

        public string LocalPlayer { get; private set; }
        public string RemotePlayer { get; private set; }
        public string SessionId { get; private set; }

        public LanConnectionStatus Status
        {
            get { return transport.Status; }
        }

        public int ReplayRevision { get; private set; }
        public string StateHash { get; private set; } = string.Empty;
        public JObject CurrentSnapshot { get; private set; } = new JObject();

        public void Join(string host, int port)
        {
            transport.Join(host, port);
        }

        public bool SendCommand(string commandType, JObject payload, out string error)
        {
            error = string.Empty;
            if (CurrentSnapshot == null || CurrentSnapshot.Count == 0)
            {
                error = "LAN client has no host snapshot.";
                return false;
            }

            if (!string.IsNullOrEmpty(pendingRequestId))
            {
                error = "LAN client command is already pending.";
                return false;
            }

            var turn = CurrentSnapshot.Value<string>("turn") ?? "p1";
            if (turn != LocalPlayer)
            {
                error = "LAN client cannot act outside its turn.";
                return false;
            }

            pendingRequestId = "client-" + NextSequence().ToString(CultureInfo.InvariantCulture);
            Send(
                LanMessageTypes.ClientCommand,
                new JObject
                {
                    ["requestId"] = pendingRequestId,
                    ["actor"] = LocalPlayer,
                    ["command"] = new JObject
                    {
                        ["type"] = commandType ?? string.Empty,
                        ["actor"] = LocalPlayer,
                        ["payload"] = payload ?? new JObject(),
                    },
                    ["baseReplayRevision"] = ReplayRevision,
                    ["baseStateHash"] = StateHash,
                }
            );
            return true;
        }

        public void RequestResync(string reason)
        {
            Send(
                LanMessageTypes.ResyncRequest,
                new JObject
                {
                    ["reason"] = reason ?? "CLIENT_REQUEST",
                    ["clientReplayRevision"] = ReplayRevision,
                    ["clientStateHash"] = StateHash,
                }
            );
        }

        public void Close()
        {
            Send(
                LanMessageTypes.Disconnect,
                new JObject
                {
                    ["sessionId"] = SessionId,
                    ["player"] = LocalPlayer,
                    ["lastReplayRevision"] = ReplayRevision,
                    ["lastStateHash"] = StateHash,
                    ["reason"] = "CLIENT_CLOSED",
                }
            );
            transport.Close();
        }

        public void Dispose()
        {
            Close();
        }

        private void OnTransportStatusChanged(object sender, LanStatusChangedEventArgs args)
        {
            StatusChanged?.Invoke(this, args);
            if (args.Status == LanConnectionStatus.Connected)
            {
                SendHello();
            }
        }

        private void OnMessageReceived(object sender, LanMessageReceivedEventArgs args)
        {
            var message = args.Message;
            if (!IsCompatible(message))
            {
                RequestResync("PROTOCOL_VERSION_MISMATCH");
                return;
            }

            switch (message.Type)
            {
                case LanMessageTypes.HelloVersion:
                    LocalPlayer = message.Payload.Value<string>("clientPlayer") ?? LocalPlayer;
                    RemotePlayer = message.Payload.Value<string>("hostPlayer") ?? RemotePlayer;
                    break;
                case LanMessageTypes.HostSnapshot:
                case LanMessageTypes.ResyncSnapshot:
                    ApplySnapshot(message);
                    break;
                case LanMessageTypes.CommandResult:
                    ApplyCommandResult(message);
                    break;
                case LanMessageTypes.StateHash:
                    VerifyStateHash(message);
                    break;
                case LanMessageTypes.Reconnect:
                    RequestResync("RECONNECT");
                    break;
            }
        }

        private void ApplySnapshot(LanMessage message)
        {
            var payload = message.Payload ?? new JObject();
            var snapshot = payload["snapshot"] as JObject;
            if (snapshot == null)
            {
                RequestResync("SNAPSHOT_MISSING");
                return;
            }

            var payloadRevision = payload.Value<int?>("replayRevision") ?? message.ReplayRevision;
            var payloadHash = payload.Value<string>("stateHash") ?? message.StateHash ?? string.Empty;
            if (payloadRevision != message.ReplayRevision || payloadHash != message.StateHash)
            {
                RequestResync("SNAPSHOT_METADATA_MISMATCH");
                return;
            }

            CurrentSnapshot = (JObject)snapshot.DeepClone();
            ReplayRevision = payloadRevision;
            StateHash = payloadHash;
            var viewer = payload.Value<string>("viewerPlayer");
            if (viewer == "p1" || viewer == "p2")
            {
                LocalPlayer = viewer;
                RemotePlayer = LanVisibilityFilter.Opponent(LocalPlayer);
            }

            SnapshotReceived?.Invoke(
                this,
                new LanSnapshotEventArgs(LocalPlayer, CurrentSnapshot, ReplayRevision, StateHash, payload.Value<string>("reason"))
            );
        }

        private void ApplyCommandResult(LanMessage message)
        {
            var payload = message.Payload ?? new JObject();
            var requestId = payload.Value<string>("requestId") ?? string.Empty;
            var accepted = payload.Value<bool?>("accepted") == true;
            var revision = payload.Value<int?>("replayRevision") ?? message.ReplayRevision;
            var hash = payload.Value<string>("stateHash") ?? message.StateHash ?? string.Empty;
            if (requestId == pendingRequestId)
            {
                pendingRequestId = string.Empty;
            }

            var result = new LanCommandResultEventArgs(
                requestId,
                payload.Value<string>("intentKind"),
                accepted,
                revision,
                hash,
                payload.Value<string>("reasonCode"),
                payload.Value<string>("reason")
            );
            CommandResultReceived?.Invoke(this, result);

            if (accepted && (revision < ReplayRevision || string.IsNullOrEmpty(hash)))
            {
                RequestResync("COMMAND_RESULT_STALE");
            }
        }

        private void VerifyStateHash(LanMessage message)
        {
            var payload = message.Payload ?? new JObject();
            var revision = payload.Value<int?>("replayRevision") ?? message.ReplayRevision;
            var hash = payload.Value<string>("stateHash") ?? message.StateHash ?? string.Empty;
            if (revision < ReplayRevision || (revision == ReplayRevision && !string.IsNullOrEmpty(hash) && hash != StateHash))
            {
                RequestResync("CHECKSUM_MISMATCH");
            }
        }

        private void SendHello()
        {
            Send(
                LanMessageTypes.HelloVersion,
                new JObject
                {
                    ["lanProtocolVersion"] = LanMessage.CurrentLanProtocolVersion,
                    ["networkProtocolVersion"] = LanMessage.SharedNetworkProtocolVersion,
                    ["appVersion"] = "unity-local-lan",
                    ["unityBuildVersion"] = "6000.4.6f1",
                    ["instanceId"] = instanceId,
                    ["supportedTransports"] = new JArray("loopback", "tcp"),
                    ["localPlayer"] = LocalPlayer,
                }
            );
        }

        private void Send(string type, JObject payload)
        {
            if (transport.Status != LanConnectionStatus.Connected)
            {
                return;
            }

            var message = LanMessage.Create(
                SessionId,
                instanceId,
                LocalPlayer,
                LanRole.Client,
                type,
                ReplayRevision,
                StateHash,
                payload,
                NextSequence()
            );
            transport.Send(message);
        }

        private int NextSequence()
        {
            messageSequence += 1;
            return messageSequence;
        }

        private static bool IsCompatible(LanMessage message)
        {
            return message != null
                && message.LanProtocolVersion == LanMessage.CurrentLanProtocolVersion
                && message.NetworkProtocolVersion == LanMessage.SharedNetworkProtocolVersion;
        }
    }
}
