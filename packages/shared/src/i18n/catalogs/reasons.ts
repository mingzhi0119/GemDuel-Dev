import type { AppReasonCode } from '../../types/reason';

export const REASON_UI_KEYS: Record<AppReasonCode, `reason.${AppReasonCode}`> = {
    AUTHORITY_REJECTED: 'reason.AUTHORITY_REJECTED',
    CHECKSUM_UNAVAILABLE: 'reason.CHECKSUM_UNAVAILABLE',
    CHECKSUM_MISMATCH: 'reason.CHECKSUM_MISMATCH',
    HEARTBEAT_TIMEOUT: 'reason.HEARTBEAT_TIMEOUT',
    MANUAL: 'reason.MANUAL',
    STALE_PACKET: 'reason.STALE_PACKET',
    NON_PROTOCOL_ACTION: 'reason.NON_PROTOCOL_ACTION',
    NOT_GUEST_TURN: 'reason.NOT_GUEST_TURN',
    NETWORK_MESSAGE_INVALID_ENVELOPE: 'reason.NETWORK_MESSAGE_INVALID_ENVELOPE',
    NETWORK_MESSAGE_INVALID_BOOTSTRAP: 'reason.NETWORK_MESSAGE_INVALID_BOOTSTRAP',
    NETWORK_MESSAGE_INVALID_GUEST_INTENT: 'reason.NETWORK_MESSAGE_INVALID_GUEST_INTENT',
    NETWORK_MESSAGE_INVALID_HOST_DECISION: 'reason.NETWORK_MESSAGE_INVALID_HOST_DECISION',
    NETWORK_MESSAGE_INVALID_SYNC_STATE: 'reason.NETWORK_MESSAGE_INVALID_SYNC_STATE',
    NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST: 'reason.NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST',
    REPLAY_FILE_TOO_LARGE: 'reason.REPLAY_FILE_TOO_LARGE',
    REPLAY_FILE_UNSUPPORTED_TYPE: 'reason.REPLAY_FILE_UNSUPPORTED_TYPE',
    REPLAY_FILE_READ_FAILED: 'reason.REPLAY_FILE_READ_FAILED',
    REPLAY_FILE_INVALID_JSON: 'reason.REPLAY_FILE_INVALID_JSON',
    REPLAY_FILE_INVALID_SCHEMA: 'reason.REPLAY_FILE_INVALID_SCHEMA',
    UNSUPPORTED_REPLAY_VERSION: 'reason.UNSUPPORTED_REPLAY_VERSION',
    TURN_CREDENTIAL_BUNDLE_INVALID: 'reason.TURN_CREDENTIAL_BUNDLE_INVALID',
    TURN_CREDENTIAL_BUNDLE_EXPIRED: 'reason.TURN_CREDENTIAL_BUNDLE_EXPIRED',
    TURN_CREDENTIAL_FETCH_FAILED: 'reason.TURN_CREDENTIAL_FETCH_FAILED',
    TURN_CREDENTIAL_REFRESH_FAILED: 'reason.TURN_CREDENTIAL_REFRESH_FAILED',
    TURN_CREDENTIAL_REVOKED: 'reason.TURN_CREDENTIAL_REVOKED',
    TURN_CREDENTIAL_REVOKE_FAILED: 'reason.TURN_CREDENTIAL_REVOKE_FAILED',
    TURN_CREDENTIAL_FALLBACK_DENIED: 'reason.TURN_CREDENTIAL_FALLBACK_DENIED',
    RUNTIME_ICE_CONFIG_INVALID: 'reason.RUNTIME_ICE_CONFIG_INVALID',
    IPC_REQUEST_REJECTED: 'reason.IPC_REQUEST_REJECTED',
    DESKTOP_POLICY_REJECTED: 'reason.DESKTOP_POLICY_REJECTED',
    RELEASE_HEALTH_CHECK_FAILED: 'reason.RELEASE_HEALTH_CHECK_FAILED',
    DEPENDENCY_AUDIT_FAILED: 'reason.DEPENDENCY_AUDIT_FAILED',
    LICENSE_ALLOWLIST_FAILED: 'reason.LICENSE_ALLOWLIST_FAILED',
    SBOM_SNAPSHOT_DRIFT: 'reason.SBOM_SNAPSHOT_DRIFT',
    SECRET_ENV_DRIFT: 'reason.SECRET_ENV_DRIFT',
};

export const enReasonMessages = {
    'reason.AUTHORITY_REJECTED': 'The host rejected that multiplayer action.',
    'reason.CHECKSUM_UNAVAILABLE': 'The host could not verify that action safely.',
    'reason.CHECKSUM_MISMATCH': 'The multiplayer session drifted and is requesting a resync.',
    'reason.HEARTBEAT_TIMEOUT':
        'Heartbeat responses stopped and the client requested a recovery snapshot.',
    'reason.MANUAL': 'A manual recovery sync was requested.',
    'reason.STALE_PACKET':
        'An out-of-date multiplayer packet was rejected and a resync was requested.',
    'reason.NON_PROTOCOL_ACTION': 'That action is not allowed over the multiplayer protocol.',
    'reason.NOT_GUEST_TURN': 'It is not the guest turn yet.',
    'reason.NETWORK_MESSAGE_INVALID_ENVELOPE':
        'An inbound network packet failed the protocol envelope contract.',
    'reason.NETWORK_MESSAGE_INVALID_BOOTSTRAP':
        'An inbound bootstrap payload failed schema validation.',
    'reason.NETWORK_MESSAGE_INVALID_GUEST_INTENT':
        'An inbound guest intent failed schema validation.',
    'reason.NETWORK_MESSAGE_INVALID_HOST_DECISION':
        'An inbound host decision failed schema validation.',
    'reason.NETWORK_MESSAGE_INVALID_SYNC_STATE':
        'An inbound sync-state payload failed schema validation.',
    'reason.NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST':
        'An inbound recovery request failed schema validation.',
    'reason.REPLAY_FILE_TOO_LARGE': 'The replay file exceeded the governed size limit.',
    'reason.REPLAY_FILE_UNSUPPORTED_TYPE': 'Replay import only accepts JSON files.',
    'reason.REPLAY_FILE_READ_FAILED': 'The replay file could not be read safely.',
    'reason.REPLAY_FILE_INVALID_JSON': 'The replay file could not be parsed as JSON.',
    'reason.REPLAY_FILE_INVALID_SCHEMA':
        'The replay file did not match the governed replay contract.',
    'reason.UNSUPPORTED_REPLAY_VERSION':
        'This replay was recorded with an unsupported legacy format.',
    'reason.TURN_CREDENTIAL_BUNDLE_INVALID':
        'The TURN credential bundle failed runtime validation.',
    'reason.TURN_CREDENTIAL_BUNDLE_EXPIRED':
        'The TURN credential bundle expired before it could be used.',
    'reason.TURN_CREDENTIAL_FETCH_FAILED':
        'The desktop runtime could not fetch short-lived TURN credentials.',
    'reason.TURN_CREDENTIAL_REFRESH_FAILED':
        'The desktop runtime could not refresh short-lived TURN credentials.',
    'reason.TURN_CREDENTIAL_REVOKED': 'The short-lived TURN credential lease was revoked.',
    'reason.TURN_CREDENTIAL_REVOKE_FAILED':
        'The desktop runtime could not confirm TURN credential revocation.',
    'reason.TURN_CREDENTIAL_FALLBACK_DENIED':
        'The runtime denied legacy relay fallback after TURN credential failure.',
    'reason.RUNTIME_ICE_CONFIG_INVALID': 'The runtime ICE configuration failed policy validation.',
    'reason.IPC_REQUEST_REJECTED': 'A privileged desktop IPC request was rejected.',
    'reason.DESKTOP_POLICY_REJECTED': 'The desktop runtime rejected a weakened security policy.',
    'reason.RELEASE_HEALTH_CHECK_FAILED': 'A release-health governance check failed.',
    'reason.DEPENDENCY_AUDIT_FAILED': 'A dependency governance audit failed.',
    'reason.LICENSE_ALLOWLIST_FAILED': 'A dependency license allowlist gate failed.',
    'reason.SBOM_SNAPSHOT_DRIFT': 'The governed SBOM snapshot drifted.',
    'reason.SECRET_ENV_DRIFT': 'A secret environment governance gate detected drift.',
} as const;

type ReasonMessageShape = { [K in keyof typeof enReasonMessages]: string };

export const zhReasonMessages: ReasonMessageShape = {
    'reason.AUTHORITY_REJECTED': '房主拒绝了这次多人操作。',
    'reason.CHECKSUM_UNAVAILABLE': '房主无法安全校验这次操作。',
    'reason.CHECKSUM_MISMATCH': '多人会话出现漂移，正在请求重新同步。',
    'reason.HEARTBEAT_TIMEOUT': '心跳响应停止，客户端已请求恢复快照。',
    'reason.MANUAL': '已请求一次手动恢复同步。',
    'reason.STALE_PACKET': '过期的多人数据包已被拒绝，并触发了重新同步请求。',
    'reason.NON_PROTOCOL_ACTION': '该操作不允许通过多人协议发送。',
    'reason.NOT_GUEST_TURN': '现在还没有轮到客方行动。',
    'reason.NETWORK_MESSAGE_INVALID_ENVELOPE': '收到的网络数据包未通过协议外层校验。',
    'reason.NETWORK_MESSAGE_INVALID_BOOTSTRAP': '收到的启动载荷未通过模式校验。',
    'reason.NETWORK_MESSAGE_INVALID_GUEST_INTENT': '收到的客方意图未通过模式校验。',
    'reason.NETWORK_MESSAGE_INVALID_HOST_DECISION': '收到的房主决策未通过模式校验。',
    'reason.NETWORK_MESSAGE_INVALID_SYNC_STATE': '收到的同步状态未通过模式校验。',
    'reason.NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST': '收到的恢复请求未通过模式校验。',
    'reason.REPLAY_FILE_TOO_LARGE': '回放文件超过了受治理的大小限制。',
    'reason.REPLAY_FILE_UNSUPPORTED_TYPE': '回放导入仅支持 JSON 文件。',
    'reason.REPLAY_FILE_READ_FAILED': '回放文件无法被安全读取。',
    'reason.REPLAY_FILE_INVALID_JSON': '回放文件无法解析为 JSON。',
    'reason.REPLAY_FILE_INVALID_SCHEMA': '回放文件不符合受治理的回放契约。',
    'reason.UNSUPPORTED_REPLAY_VERSION': '该回放来自已废弃的旧格式，当前版本不再支持。',
    'reason.TURN_CREDENTIAL_BUNDLE_INVALID': 'TURN 凭证包未通过运行时校验。',
    'reason.TURN_CREDENTIAL_BUNDLE_EXPIRED': 'TURN 凭证包在使用前已经过期。',
    'reason.TURN_CREDENTIAL_FETCH_FAILED': '桌面运行时无法获取短时 TURN 凭证。',
    'reason.TURN_CREDENTIAL_REFRESH_FAILED': '桌面运行时无法刷新短时 TURN 凭证。',
    'reason.TURN_CREDENTIAL_REVOKED': '短时 TURN 凭证租约已被撤销。',
    'reason.TURN_CREDENTIAL_REVOKE_FAILED': '桌面运行时无法确认 TURN 凭证已撤销。',
    'reason.TURN_CREDENTIAL_FALLBACK_DENIED': 'TURN 凭证失败后，运行时拒绝回退到旧的中继方案。',
    'reason.RUNTIME_ICE_CONFIG_INVALID': '运行时 ICE 配置未通过策略校验。',
    'reason.IPC_REQUEST_REJECTED': '一项特权桌面 IPC 请求已被拒绝。',
    'reason.DESKTOP_POLICY_REJECTED': '桌面运行时拒绝了被削弱的安全策略。',
    'reason.RELEASE_HEALTH_CHECK_FAILED': '发布健康治理检查失败。',
    'reason.DEPENDENCY_AUDIT_FAILED': '依赖治理审计失败。',
    'reason.LICENSE_ALLOWLIST_FAILED': '依赖许可证白名单检查失败。',
    'reason.SBOM_SNAPSHOT_DRIFT': '受治理的 SBOM 快照发生漂移。',
    'reason.SECRET_ENV_DRIFT': '密钥环境治理检查检测到了漂移。',
} as const;
