export type CardPreviewActionId = 'buy' | 'reserve' | string;

export interface CardPreviewAction {
    id: CardPreviewActionId;
    label: string;
    disabled?: boolean;
    onAction?: () => boolean | void;
}

export const createCardPreviewActions = (
    ...actions: Array<CardPreviewAction | null | undefined | false>
): CardPreviewAction[] => actions.filter((action): action is CardPreviewAction => Boolean(action));
