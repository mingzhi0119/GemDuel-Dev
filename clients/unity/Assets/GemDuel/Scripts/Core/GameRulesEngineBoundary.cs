using Newtonsoft.Json.Linq;

namespace GemDuel.Core
{
    public sealed class GameRulesCommand
    {
        public string Type { get; set; } = string.Empty;
        public string Actor { get; set; } = string.Empty;
        public JObject Payload { get; set; } = new JObject();
    }

    public sealed class GameRulesResult
    {
        public bool Ok { get; private set; }
        public JObject State { get; private set; }
        public JObject Init { get; private set; }
        public string StateHash { get; private set; }
        public string ErrorCode { get; private set; }
        public string Error { get; private set; }
        public int ReplayRevision { get; private set; }
        public string ActionType { get; private set; }

        private GameRulesResult(
            bool ok,
            JObject state,
            JObject init,
            string stateHash,
            string errorCode,
            string error,
            int replayRevision,
            string actionType
        )
        {
            Ok = ok;
            State = state;
            Init = init;
            StateHash = stateHash;
            ErrorCode = errorCode;
            Error = error;
            ReplayRevision = replayRevision;
            ActionType = actionType;
        }

        public static GameRulesResult Pass(JObject state, string stateHash)
        {
            return Pass(state, new JObject(), stateHash, 0, string.Empty);
        }

        public static GameRulesResult Pass(
            JObject state,
            JObject init,
            string stateHash,
            int replayRevision,
            string actionType
        )
        {
            return new GameRulesResult(
                true,
                state,
                init,
                stateHash,
                string.Empty,
                string.Empty,
                replayRevision,
                actionType
            );
        }

        public static GameRulesResult Fail(string errorCode, string error)
        {
            return Fail(errorCode, error, null, new JObject(), string.Empty, 0, string.Empty);
        }

        public static GameRulesResult Fail(
            string errorCode,
            string error,
            JObject state,
            JObject init,
            string stateHash,
            int replayRevision,
            string actionType
        )
        {
            return new GameRulesResult(
                false,
                state,
                init,
                stateHash,
                errorCode,
                error,
                replayRevision,
                actionType
            );
        }
    }

    public interface IGameRulesEngine
    {
        GameRulesResult StartLocalGame(string seed, bool useBuffs = false);

        void RestoreSession(JObject init);

        GameRulesResult ApplyCommand(GameState state, GameRulesCommand command);
    }
}
