import { Hand, Plus, RotateCcw, Scroll, Shield, Swords } from 'lucide-react';
import type { ReactElement } from 'react';
import { getAbilityLabel, getGemLabel, getPlayerDisplayName } from '@gemduel/shared';
import { canActionRunInPhase } from '@gemduel/shared/logic/fsm';
import { cn } from '../../utils';
import type { Buff, EffectiveCardAbility, GamePhase } from '@gemduel/shared/types';
import { useLocale, useT } from '../../i18n/LocaleProvider';
import { PlayerBuffIcon } from './PlayerBuffIcon';
import { READABILITY_HUD_TEXT_STYLE } from '../readabilityHudStyles';
import type { PlayerZoneBuffPreviewAction } from './types';

interface PlayerZoneIdentityColumnProps {
    player: 'p1' | 'p2';
    privileges: number;
    extraPrivileges: number;
    buff: Buff;
    isActive: boolean;
    isPrivilegeMode: boolean;
    phase: GamePhase | string;
    theme: 'light' | 'dark';
    onUsePrivilege: () => void;
    dividerSide?: 'left' | 'right';
    buffPreviewAction?: PlayerZoneBuffPreviewAction;
    readabilityTreatment?: boolean;
}

const MEMORY_ICON_BY_ABILITY: Record<
    EffectiveCardAbility,
    typeof RotateCcw | typeof Hand | typeof Scroll | typeof Plus
> = {
    again: RotateCcw,
    steal: Hand,
    scroll: Scroll,
    bonus_gem: Plus,
};

const getEchoReservoirMemory = (buff: Buff, locale: 'en' | 'zh') => {
    if (!buff.effects?.passive?.echoReservoir) {
        return null;
    }

    const storedAbilities = (buff.state?.echoReservoirStoredAbilities ?? []).filter(
        (ability): ability is EffectiveCardAbility =>
            ability === 'again' ||
            ability === 'steal' ||
            ability === 'scroll' ||
            ability === 'bonus_gem'
    );

    if (storedAbilities.length === 0) {
        return null;
    }

    const storedColor = buff.state?.echoReservoirStoredBonusColor;
    const labels = storedAbilities.map((ability) => {
        const baseLabel = getAbilityLabel(ability, locale);
        if (ability !== 'bonus_gem' || !storedColor || storedColor === 'null') {
            return baseLabel;
        }

        return `${baseLabel} (${getGemLabel(storedColor, locale)})`;
    });

    return {
        labels,
        abilities: storedAbilities,
        detail: labels.join(' + '),
    };
};

export function PlayerZoneIdentityColumn({
    player,
    privileges,
    extraPrivileges,
    buff,
    isActive,
    isPrivilegeMode,
    phase,
    theme,
    onUsePrivilege,
    dividerSide = 'right',
    buffPreviewAction,
    readabilityTreatment = false,
}: PlayerZoneIdentityColumnProps) {
    const { locale } = useLocale();
    const t = useT();
    const total = privileges + extraPrivileges;
    const echoReservoirMemory = getEchoReservoirMemory(buff, locale);
    const canUsePrivilege =
        isActive && !isPrivilegeMode && canActionRunInPhase('ACTIVATE_PRIVILEGE', phase);
    const items: ReactElement[] = [];
    let currentIndex = 0;

    for (let i = 0; i < Math.max(0, privileges); i++) {
        const idx = currentIndex++;
        items.push(
            <button
                key={`std-${i}`}
                data-player-zone-privilege={`${player}-standard-${i}`}
                disabled={!canUsePrivilege}
                onClick={onUsePrivilege}
                className={cn(
                    'transition-all',
                    canUsePrivilege
                        ? 'hover:scale-110 hover:text-amber-100 cursor-pointer animate-pulse'
                        : 'opacity-80 cursor-default',
                    (total === 1 || (total === 3 && idx === 2)) && 'col-span-2 justify-self-center'
                )}
            >
                <Scroll
                    size={30}
                    fill="#fcd34d"
                    className={theme === 'dark' ? 'text-amber-200' : 'text-amber-500'}
                />
            </button>
        );
    }

    for (let i = 0; i < Math.max(0, extraPrivileges); i++) {
        const idx = currentIndex++;
        items.push(
            <button
                key={`extra-${i}`}
                data-player-zone-privilege={`${player}-extra-${i}`}
                disabled={!canUsePrivilege}
                onClick={onUsePrivilege}
                className={cn(
                    'transition-all',
                    canUsePrivilege
                        ? 'hover:scale-110 hover:text-yellow-200 cursor-pointer animate-pulse'
                        : 'opacity-80 cursor-default',
                    (total === 1 || (total === 3 && idx === 2)) && 'col-span-2 justify-self-center'
                )}
                title={t('player.specialPrivilegeProtected')}
            >
                <Scroll size={30} fill="#fbbf24" className="text-yellow-500" />
            </button>
        );
    }

    return (
        <div
            data-player-zone-column="identity"
            data-readability-hud-chip={readabilityTreatment ? 'player-identity' : undefined}
            className={`self-stretch flex flex-col gap-5 min-w-[128px] shrink-0 items-center justify-center transition-colors duration-500 ${
                dividerSide === 'right' ? 'border-r pr-3' : 'border-l pl-3'
            }
            ${theme === 'dark' ? 'border-slate-700' : 'border-stone-300'}
      `}
            style={readabilityTreatment ? READABILITY_HUD_TEXT_STYLE : undefined}
        >
            <div className="flex flex-col items-center gap-2">
                <div
                    data-player-buff-preview-slot={player}
                    className="flex h-14 w-full items-center justify-center"
                >
                    {buffPreviewAction ? (
                        <button
                            type="button"
                            data-player-buff-preview-action={buffPreviewAction.id}
                            data-player-buff-preview-player={player}
                            disabled={buffPreviewAction.disabled}
                            onClick={buffPreviewAction.onClick}
                            className={`flex h-12 w-[95%] items-center justify-center rounded-md border px-2 py-0 text-center text-[20px] font-black uppercase leading-none tracking-[0.12em] transition-all ${
                                theme === 'dark'
                                    ? 'border-purple-300/45 bg-purple-500/18 text-purple-100 shadow-[0_0_18px_rgba(168,85,247,0.16)]'
                                    : 'border-purple-500/30 bg-purple-50 text-purple-800'
                            } enabled:hover:scale-105 enabled:hover:bg-purple-500/28 disabled:cursor-not-allowed disabled:opacity-45`}
                            aria-label={buffPreviewAction.label}
                        >
                            <span>{buffPreviewAction.label}</span>
                        </button>
                    ) : null}
                </div>
                {echoReservoirMemory ? (
                    <div
                        data-echo-reservoir-memory={player}
                        data-echo-reservoir-memory-detail={echoReservoirMemory.detail}
                        title={echoReservoirMemory.detail}
                        className={`max-w-[136px] rounded-full border px-3 py-1 text-center text-[10px] font-black uppercase tracking-[0.08em] leading-tight ${
                            theme === 'dark'
                                ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100'
                                : 'border-cyan-500/30 bg-cyan-50 text-cyan-800'
                        }`}
                    >
                        <div className="mb-1 flex items-center justify-center gap-1">
                            {echoReservoirMemory.abilities.map((ability, index) => {
                                const Icon = MEMORY_ICON_BY_ABILITY[ability];
                                return (
                                    <Icon
                                        key={`${ability}-${index}`}
                                        size={10}
                                        className="shrink-0"
                                    />
                                );
                            })}
                        </div>
                        <div>{echoReservoirMemory.detail}</div>
                    </div>
                ) : null}
                {buff?.id && buff.id !== 'none' ? (
                    <div data-player-avatar={player}>
                        <PlayerBuffIcon
                            buff={buff}
                            playerKey={player}
                            theme={theme}
                            locale={locale}
                            variant="avatar"
                        />
                    </div>
                ) : (
                    <div
                        className={`p-4 rounded-full ${isActive ? (player === 'p1' ? 'bg-emerald-600' : 'bg-blue-600') : theme === 'dark' ? 'bg-slate-700' : 'bg-stone-300'}`}
                        data-player-avatar={player}
                    >
                        {player === 'p1' ? (
                            <Shield
                                size={40}
                                data-player-avatar-fallback="shield"
                                className={
                                    theme === 'dark' || isActive ? 'text-white' : 'text-stone-600'
                                }
                            />
                        ) : (
                            <Swords
                                size={40}
                                data-player-avatar-fallback="swords"
                                className={
                                    theme === 'dark' || isActive ? 'text-white' : 'text-stone-600'
                                }
                            />
                        )}
                    </div>
                )}
                <h3
                    className={`font-black text-[20px] whitespace-nowrap uppercase tracking-[0.16em] ${
                        isActive
                            ? player === 'p1'
                                ? 'text-emerald-500'
                                : 'text-blue-500'
                            : theme === 'dark'
                              ? 'text-slate-300'
                              : 'text-stone-600'
                    }`}
                    style={readabilityTreatment ? READABILITY_HUD_TEXT_STYLE : undefined}
                >
                    {getPlayerDisplayName(player, locale)}
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 justify-items-start h-[72px] items-start">
                {items.length === 0 ? (
                    <div className="col-span-2 justify-self-center">
                        <Scroll
                            size={30}
                            className={theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}
                        />
                    </div>
                ) : (
                    items
                )}
            </div>
        </div>
    );
}
