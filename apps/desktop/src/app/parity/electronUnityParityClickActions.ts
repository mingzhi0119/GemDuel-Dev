import { createBoardParityClickActions } from './electronUnityParityBoardClickActions';
import { createCardParityClickActions } from './electronUnityParityCardClickActions';
import { createChromeParityClickActions } from './electronUnityParityChromeClickActions';
import type { ClickActionDeps, ReplayEventLike } from './electronUnityParityClickActionSupport';

export type { ReplayEventLike };

export const createElectronUnityClickActions = (deps: ClickActionDeps) => ({
    ...createChromeParityClickActions(deps),
    ...createCardParityClickActions(deps),
    ...createBoardParityClickActions(deps),
});
