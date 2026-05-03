import type React from 'react';
import type {
    Card as CardType,
    Buff,
    GamePhase,
    GemInventory,
    PlayerKey,
    RoyalCard,
} from '@gemduel/shared/types';

export interface PlayerZoneProps {
    player: PlayerKey;
    inventory: GemInventory;
    cards: CardType[];
    reserved: CardType[];
    royals?: RoyalCard[];
    privileges: number;
    extraPrivileges?: number;
    isActive: boolean;
    phase: GamePhase | string;
    lastFeedback: {
        uid: string;
        items: Array<{ player: PlayerKey; type: string; diff: number }>;
    } | null;
    onBuyReserved: (card: CardType, execute?: boolean) => boolean;
    onDiscardReserved: (cardId: string) => void;
    onUsePrivilege: () => void;
    isPrivilegeMode: boolean;
    onGemClick: (color: string) => void;
    isStealMode: boolean;
    isDiscardMode: boolean;
    buff: Buff;
    theme: 'light' | 'dark';
    score: number;
    crowns: number;
    surfaceStyle?: React.CSSProperties;
    surfaceArtwork?: PlayerZoneSurfaceArtwork;
    surfaceVariant?: string;
    readabilityTreatment?: boolean;
    pendingReservedCardIds?: string[];
    onPreviewStack?: (stack: PlayerZoneStackState & { player: PlayerKey }) => void;
    buffPreviewAction?: PlayerZoneBuffPreviewAction;
}

export interface PlayerZoneBuffPreviewAction {
    id: 'peek' | 'reveal' | string;
    label: string;
    disabled?: boolean;
    onClick: () => void;
}

export interface PlayerZoneSurfaceArtwork {
    primaryPath: string;
    fallbackPath?: string;
    mirrorFallback?: boolean;
    objectPosition?: React.CSSProperties['objectPosition'];
}

export interface PlayerZoneStackState {
    color: string;
    cards: CardType[];
    title?: string;
}

export interface PlayerZoneFeedbackItem {
    id: number;
    quantity: string;
    label: string;
    type: string;
}

export interface PlayerZoneColorStats {
    cards: CardType[];
    bonusCount: number;
    points: number;
}

export interface PlayerZoneSpecialStackStats extends PlayerZoneColorStats {
    purePointCount: number;
    royalCount: number;
}

export interface PlayerZoneScaledCardFrameProps {
    scale: number;
    baseSize?: {
        width: number;
        height: number;
    };
    children: React.ReactNode;
}
