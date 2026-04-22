import { describe, expect, it } from 'vitest';
import { getReasonDescriptor } from '../../logic/reasonCatalog';
import { enLabelMessages, zhLabelMessages } from '../catalogs/labels';
import { enLooseMessages, zhLooseMessages } from '../catalogs/loose';
import { enReasonMessages, REASON_UI_KEYS, zhReasonMessages } from '../catalogs/reasons';
import { enUiMessages, zhUiMessages } from '../catalogs/ui';
import { localizeLooseUiMessage, resolveSystemAppLocale, translate } from '../index';

const expectMatchingKeys = (left: Record<string, string>, right: Record<string, string>) => {
    expect(Object.keys(right).sort()).toEqual(Object.keys(left).sort());
};

describe('shared i18n catalogs', () => {
    it('keeps English and Chinese catalogs in key parity for every domain', () => {
        expectMatchingKeys(enUiMessages, zhUiMessages);
        expectMatchingKeys(enLabelMessages, zhLabelMessages);
        expectMatchingKeys(enReasonMessages, zhReasonMessages);
        expectMatchingKeys(enLooseMessages, zhLooseMessages);
    });

    it('covers every visible AppReasonCode with a UI translation key', () => {
        Object.keys(REASON_UI_KEYS).forEach((reasonCode) => {
            expect(getReasonDescriptor(reasonCode as keyof typeof REASON_UI_KEYS)).toBeDefined();
            expect(
                translate('zh', REASON_UI_KEYS[reasonCode as keyof typeof REASON_UI_KEYS])
            ).toBeTruthy();
        });
    });

    it('maps zh-* system locales to the Simplified Chinese catalog in v1', () => {
        expect(resolveSystemAppLocale('zh-CN')).toBe('zh');
        expect(resolveSystemAppLocale('zh-HK')).toBe('zh');
        expect(resolveSystemAppLocale('en-US')).toBe('en');
    });

    it('localizes loose renderer-visible messages without touching internal reason catalogs', () => {
        expect(localizeLooseUiMessage('Searching for opponent on local network...', 'zh')).toBe(
            '正在本地网络中搜索对手...'
        );
        expect(localizeLooseUiMessage('Replay import only accepts JSON files.', 'zh')).toBe(
            '回放导入仅支持 JSON 文件。'
        );
    });
});
