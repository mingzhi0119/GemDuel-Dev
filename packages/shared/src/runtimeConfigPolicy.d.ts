export interface RuntimeConfigPolicyEntry {
    owner: string;
    defaultValue: string;
    validation: string;
    secretHandling: string;
    failureMode: string;
}

export declare const VALID_LOG_LEVELS_LIST: readonly string[];
export declare const VALID_LOG_LEVELS: ReadonlySet<string>;
export declare const TURN_CREDENTIAL_BUNDLE_POLICY_VERSION: 1;
export declare const TURN_CREDENTIAL_SERVICE_POLICY_VERSION: 1;
export declare const TURN_CREDENTIAL_SERVICE_FALLBACK_MODES: readonly string[];
export declare const RUNTIME_CONFIG_POLICY: Readonly<Record<string, RuntimeConfigPolicyEntry>>;
