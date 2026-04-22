import { describe, expect, it } from 'vitest';
import { readLanDevVerificationConfig } from '../useLanDevVerification';

describe('readLanDevVerificationConfig', () => {
    it('stays disabled without the verification query flag', () => {
        expect(readLanDevVerificationConfig('')).toEqual({ enabled: false });
        expect(readLanDevVerificationConfig('?foo=bar')).toEqual({ enabled: false });
    });

    it('requires a supported LAN mode', () => {
        expect(readLanDevVerificationConfig('?lanHarness=1')).toEqual({ enabled: false });
        expect(readLanDevVerificationConfig('?lanHarness=1&lanMode=invalid')).toEqual({
            enabled: false,
        });
    });

    it('extracts the mode and profile for local dual-instance verification', () => {
        expect(
            readLanDevVerificationConfig('?lanHarness=1&lanMode=classic&lanProfile=alpha')
        ).toEqual({
            enabled: true,
            mode: 'classic',
            profile: 'alpha',
        });
    });
});
