import type React from 'react';
import type {
    Card as CardType,
    Buff,
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
    surfaceVariant?: string;
}

export interface PlayerZoneStackState {
    color: string;
    cards: CardType[];
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

export interface PlayerZoneScaledCardFrameProps {
    scale: number;
    children: React.ReactNode;
}
