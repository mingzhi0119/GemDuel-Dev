export declare const ALLOWED_ICE_URL_PROTOCOLS: readonly string[];

export declare const toIceUrlList: (urls: unknown) => string[] | null;
export declare const isAllowedIceUrl: (url: string) => boolean;
export declare const isTurnIceUrl: (url: string) => boolean;
export declare const collectIceServerPolicyViolations: (value: unknown) => string[];
