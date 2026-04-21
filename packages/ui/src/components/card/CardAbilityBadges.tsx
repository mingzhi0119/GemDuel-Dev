import React from 'react';
import { RotateCcw, Hand, Scroll, Plus } from 'lucide-react';
import { ABILITIES } from '@gemduel/shared/constants';
import { Card as CardType } from '@gemduel/shared/types';

interface CardAbilityBadgesProps {
    ability?: CardType['ability'];
    stackedGapPx: number;
    abilityIconSizePx: number;
    abilityBadgePaddingPx: number;
    abilityBadgeRadiusPx: number;
}

export const CardAbilityBadges: React.FC<CardAbilityBadgesProps> = ({
    ability,
    stackedGapPx,
    abilityIconSizePx,
    abilityBadgePaddingPx,
    abilityBadgeRadiusPx,
}) => {
    let abilitiesList: string[] = [];
    if (Array.isArray(ability)) {
        abilitiesList = ability;
    } else if (ability && ability !== 'none') {
        abilitiesList = [ability];
    }

    if (abilitiesList.length === 0) {
        return null;
    }

    return (
        <div
            className="flex flex-row"
            style={{
                gap: `${stackedGapPx}px`,
                marginTop: `${stackedGapPx}px`,
            }}
        >
            {abilitiesList.map((abilId, idx) => {
                const iconProps = {
                    size: abilityIconSizePx,
                    className: 'text-white drop-shadow-md',
                };
                let IconComponent: React.ComponentType<{
                    size?: number;
                    className?: string;
                }> | null = null;
                let bgColor = 'bg-slate-600';

                switch (abilId) {
                    case ABILITIES.AGAIN.id:
                        IconComponent = RotateCcw;
                        bgColor = 'bg-amber-500';
                        break;
                    case ABILITIES.STEAL.id:
                        IconComponent = Hand;
                        bgColor = 'bg-rose-500';
                        break;
                    case ABILITIES.SCROLL.id:
                        IconComponent = Scroll;
                        bgColor = 'bg-purple-500';
                        break;
                    case ABILITIES.BONUS_GEM.id:
                        IconComponent = Plus;
                        bgColor = 'bg-emerald-500';
                        break;
                    default:
                        return null;
                }

                return (
                    <div
                        key={idx}
                        className={`${bgColor} shadow-md flex items-center justify-center`}
                        title={abilId}
                        style={{
                            padding: `${abilityBadgePaddingPx}px`,
                            borderRadius: `${abilityBadgeRadiusPx}px`,
                        }}
                    >
                        <IconComponent {...iconProps} />
                    </div>
                );
            })}
        </div>
    );
};
