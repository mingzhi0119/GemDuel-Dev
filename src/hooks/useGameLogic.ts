import { useState, useEffect, useCallback, useMemo } from 'react';
import { GRID_SIZE, BUFFS } from '../constants';
import { generateGemPool, generateDeck, shuffleArray, calculateTransaction } from '../utils';
import { useActionHistory } from './useActionHistory';
import { applyAction } from '../logic/gameReducer';
import { INITIAL_STATE_SKELETON } from '../logic/initialState';
import { processGemClick, processOpponentGemClick } from '../logic/interactionManager';
import { getPlayerScore, getCrownCount } from '../logic/selectors';
import { validateGemSelection } from '../logic/validators';
import {
    GameState,
    Card,
    PlayerKey,
    GemCoord,
    GameAction,
    GemTypeObject,
    GameMode,
} from '../types';
import { computeAiAction } from '../logic/ai/aiPlayer';
import { useOnlineManager } from './useOnlineManager';
import { generateGameStateHash } from '../utils/checksum';

export const useGameLogic = (shouldConnect: boolean = false) => {
    // 1. Core State & History
    const {
        history,
        currentIndex,
        recordAction: recordLocalAction,
        undo,
        redo,
        canUndo,
        canRedo,
        importHistory,
        clearAndInit,
    } = useActionHistory();

    // 2. Derive GameState from History
    const gameState = useMemo(() => {
        if (history.length === 0) return INITIAL_STATE_SKELETON;
        let state: GameState | null = null;
        const limit = Math.min(currentIndex, history.length - 1);

        for (let i = 0; i <= limit; i++) {
            if (history[i]) state = applyAction(state, history[i]);
        }
        return state || INITIAL_STATE_SKELETON;
    }, [currentIndex, history]);

    // 3. Authority Validation Logic (For Host)
    const validateOnlineAction = useCallback((state: GameState, action: GameAction): boolean => {
        if (action.type === 'INIT' || action.type === 'INIT_DRAFT') return true;
        if (state.turn !== 'p2') {
            console.warn(
                `Host rejected request: Action ${action.type} received during ${state.turn}'s turn`
            );
            return false;
        }
        return true;
    }, []);

    // 4. Online Manager Implementation
    const handleRemoteAction = useCallback(
        (action: GameAction, remoteChecksum?: string) => {
            console.log(`[NET-RECEIVE] Action: ${action.type}`, action.payload);
            if (action.type === 'INIT' || action.type === 'INIT_DRAFT') {
                const guestAction = {
                    ...action,
                    payload: { ...action.payload, isHost: false },
                };
                clearAndInit(guestAction);
            } else {
                if (remoteChecksum && gameState) {
                    const predicted = applyAction(gameState, action);
                    const localHash = generateGameStateHash(predicted);
                    if (localHash !== remoteChecksum) {
                        console.error(`DESYNC: Local ${localHash} vs Remote ${remoteChecksum}`);
                    }
                }
                recordLocalAction(action);
            }
        },
        [recordLocalAction, clearAndInit, gameState]
    );

    const handleStateReceived = useCallback(
        (authoritativeState: GameState) => {
            const guestStateSnapshot = { ...authoritativeState, isHost: false };
            recordLocalAction({ type: 'FORCE_SYNC', payload: guestStateSnapshot });
        },
        [recordLocalAction]
    );

    const handleGuestRequest = useCallback(
        (action: GameAction) => {
            if (gameState.mode === 'ONLINE_MULTIPLAYER' && gameState.isHost) {
                if (validateOnlineAction(gameState, action)) {
                    recordLocalAction(action);
                }
            }
        },
        [gameState, recordLocalAction, validateOnlineAction]
    );

    const online = useOnlineManager(
        handleRemoteAction,
        handleStateReceived,
        handleGuestRequest,
        gameState.mode === 'ONLINE_MULTIPLAYER' || shouldConnect
    );

    // 5. Control & Input Decoupling
    const canLocalInteract = useMemo(() => {
        const mode = gameState.mode;
        if (mode === 'LOCAL_PVP') return true;
        if (mode === 'PVE') return gameState.turn === 'p1';
        if (mode === 'ONLINE_MULTIPLAYER') {
            const myRole: PlayerKey = gameState.isHost ? 'p1' : 'p2';
            return gameState.turn === myRole;
        }
        return true;
    }, [gameState.mode, gameState.turn, gameState.isHost]);

    // Wrapper for recording actions
    const recordAction = useCallback(
        (action: GameAction) => {
            console.log(`[ACTION-RECORD] Type: ${action.type}`, action.payload);
            const isInit = action.type === 'INIT' || action.type === 'INIT_DRAFT';

            if (gameState.mode === 'ONLINE_MULTIPLAYER') {
                if (gameState.isHost) {
                    recordLocalAction(action);

                    // Predict and sync immediately for initial actions to trigger Guest UI transition
                    if (isInit) {
                        const next = applyAction(null, action);
                        const hash = generateGameStateHash(next);
                        online.sendAction(action, hash);
                    }
                } else {
                    if (gameState.turn === 'p2') {
                        online.sendGuestRequest(action);
                    }
                }
                return;
            }

            recordLocalAction(action);

            if (isInit && (action.payload.mode === 'ONLINE_MULTIPLAYER' || shouldConnect)) {
                const next = applyAction(null, action);
                const hash = generateGameStateHash(next);
                online.sendAction(action, hash);
            }
        },
        [gameState, online, recordLocalAction, shouldConnect, canLocalInteract]
    );

    // Host Broadcast Effect
    useEffect(() => {
        if (gameState.mode === 'ONLINE_MULTIPLAYER' && gameState.isHost && history.length > 0) {
            online.sendState(gameState);
        }
    }, [gameState, history.length, online]);

    // 6. UI/Transient State
    const [selectedGems, setSelectedGems] = useState<GemCoord[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setSelectedGems([]);
    }, [currentIndex]);

    // Flattening Logic
    useEffect(() => {
        if (
            gameState.phase === 'IDLE' &&
            history.length > 1 &&
            history.some((a) => a.type === 'SELECT_BUFF' || a.type === 'INIT_DRAFT')
        ) {
            const flattenedAction = {
                type: 'FLATTEN',
                payload: JSON.parse(JSON.stringify(gameState)),
            };
            clearAndInit(flattenedAction);
        }
    }, [gameState.phase, history, clearAndInit, gameState]);

    // AI Engine Trigger
    useEffect(() => {
        if (gameState && gameState.mode === 'PVE' && gameState.turn === 'p2' && !gameState.winner) {
            const timer = setTimeout(() => {
                const aiAction = computeAiAction(gameState);
                if (aiAction) recordAction(aiAction);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState, recordAction]);

    // Initialization Logic
    const startGame = useCallback(
        (
            mode: GameMode,
            options: { useBuffs: boolean; isHost?: boolean } = { useBuffs: false }
        ) => {
            const isRogue = options.useBuffs;
            const fullPool = generateGemPool();
            const initialBoardFlat = fullPool.slice(0, 25);
            const initialBag = fullPool.slice(25);
            const newBoard: any[][] = [];
            for (let r = 0; r < GRID_SIZE; r++) {
                const row = [];
                for (let c = 0; c < GRID_SIZE; c++) {
                    row.push(initialBoardFlat[r * GRID_SIZE + c]);
                }
                newBoard.push(row);
            }
            const d1 = generateDeck(1, isRogue);
            const d2 = generateDeck(2, isRogue);
            const d3 = generateDeck(3, isRogue);
            const market = { 3: d3.splice(0, 3), 2: d2.splice(0, 4), 1: d1.splice(0, 5) };
            const decks = { 1: d1, 2: d2, 3: d3 };

            const basics = ['red', 'green', 'blue', 'white', 'black'];
            const initRandoms = {
                p1: {
                    randomGems: Array.from(
                        { length: 5 },
                        () => basics[Math.floor(Math.random() * 5)]
                    ),
                    reserveCardLevel: Math.floor(Math.random() * 3) + 1,
                    preferenceColor: basics[Math.floor(Math.random() * 5)],
                },
                p2: {
                    randomGems: Array.from(
                        { length: 5 },
                        () => basics[Math.floor(Math.random() * 5)]
                    ),
                    reserveCardLevel: Math.floor(Math.random() * 3) + 1,
                    preferenceColor: basics[Math.floor(Math.random() * 5)],
                },
            };

            const setupData: any = {
                mode,
                board: newBoard,
                bag: initialBag,
                market,
                decks,
                initRandoms,
                isHost: options.isHost ?? true,
            };

            if (options.useBuffs) {
                const level = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
                const levelBuffs = Object.values(BUFFS).filter((b) => b.level === level);
                const fullPool = shuffleArray(levelBuffs).slice(0, 3);
                // IDs only
                setupData.draftPool = fullPool.map((b) => b.id);
                setupData.buffLevel = level;

                recordAction({ type: 'INIT_DRAFT', payload: setupData });
            } else {
                recordAction({ type: 'INIT', payload: setupData });
            }
        },
        [recordAction]
    );

    // --- Helpers ---
    const isSelected = (r: number, c: number) => selectedGems.some((s) => s.r === r && s.c === c);
    const canAfford = useCallback(
        (card: Card) => {
            if (!gameState) return false;
            const player = gameState.turn;
            const { affordable } = calculateTransaction(
                card,
                gameState.inventories[player],
                gameState.playerTableau[player],
                gameState.playerBuffs?.[player]
            );
            return affordable;
        },
        [gameState]
    );

    const handleSelfGemClick = (gemId: string) => {
        if (!canLocalInteract || gameState.phase !== 'DISCARD_EXCESS_GEMS') return;
        recordAction({ type: 'DISCARD_GEM', payload: gemId });
    };
    const handleGemClick = (r: number, c: number) => {
        if (!canLocalInteract || gameState.winner) return;
        const result = processGemClick(gameState, r, c, selectedGems);
        if (result.error) return setErrorMsg(result.error);
        if (result.action) return recordAction(result.action);
        if (result.newSelection) setSelectedGems(result.newSelection);
    };
    const handleOpponentGemClick = (gemId: string) => {
        if (!canLocalInteract) return;
        const result = processOpponentGemClick(gameState, gemId as any);
        if (result.error) return setErrorMsg(result.error);
        if (result.action) recordAction(result.action);
    };
    const handleConfirmTake = () => {
        if (!canLocalInteract || selectedGems.length === 0) return;
        const check = validateGemSelection(selectedGems);
        if (!check.valid) return setErrorMsg(check.error || 'Invalid!');
        if (check.hasGap) return setErrorMsg('Gap detected!');
        const buff = gameState.playerBuffs?.[gameState.turn];
        if (buff?.effects?.passive?.noTake3 && selectedGems.length === 3)
            return setErrorMsg('Cannot take 3 gems!');
        recordAction({ type: 'TAKE_GEMS', payload: { coords: selectedGems } });
        setSelectedGems([]);
    };
    const handleReplenish = () => {
        if (!canLocalInteract || gameState.bag.length === 0) return;
        const basics = ['red', 'green', 'blue', 'white', 'black'];
        const opponent = gameState.turn === 'p1' ? 'p2' : 'p1';
        const stealable = Object.keys(gameState.inventories[opponent]).filter(
            (k) => k !== 'gold' && k !== 'pearl' && gameState.inventories[opponent][k] > 0
        );
        recordAction({
            type: 'REPLENISH',
            payload: {
                randoms: {
                    expansionColor: basics[Math.floor(Math.random() * 5)],
                    extortionColor:
                        stealable.length > 0
                            ? stealable[Math.floor(Math.random() * stealable.length)]
                            : undefined,
                },
            },
        });
    };
    const handleReserveCard = (card: Card, level: number, idx: number) => {
        if (!canLocalInteract || gameState.playerReserved[gameState.turn].length >= 3) return;
        const hasGold = gameState.board.flat().some((cell) => cell.type.id === 'gold');
        if (hasGold) {
            recordAction({ type: 'INITIATE_RESERVE', payload: { card, level, idx } });
            setErrorMsg('Select a Gold gem.');
        } else {
            recordAction({ type: 'RESERVE_CARD', payload: { card, level, idx } });
        }
    };
    const handleReserveDeck = (level: number) => {
        if (!canLocalInteract || gameState.playerReserved[gameState.turn].length >= 3) return;
        if (gameState.decks[level as 1 | 2 | 3].length === 0) return setErrorMsg('Deck empty!');
        const hasGold = gameState.board.flat().some((cell) => cell.type.id === 'gold');
        recordAction({
            type: hasGold ? 'INITIATE_RESERVE_DECK' : 'RESERVE_DECK',
            payload: { level },
        });
    };
    const initiateBuy = (card: Card, source: string = 'market', marketInfo: any = {}) => {
        if (!canLocalInteract) return;
        const affordable = canAfford(card);
        if (!affordable) return setErrorMsg('Cannot afford!');
        if (card.bonusColor === 'gold') {
            recordAction({ type: 'INITIATE_BUY_JOKER', payload: { card, source, marketInfo } });
        } else {
            const basics = ['red', 'green', 'blue', 'white', 'black'];
            recordAction({
                type: 'BUY_CARD',
                payload: {
                    card,
                    source,
                    marketInfo,
                    randoms: { bountyHunterColor: basics[Math.floor(Math.random() * 5)] },
                },
            });
        }
    };
    const handleSelectBonusColor = (color: string) => {
        if (!canLocalInteract || gameState.phase !== 'SELECT_CARD_COLOR' || !gameState.pendingBuy)
            return;
        const { card, source, marketInfo } = gameState.pendingBuy;
        const basics = ['red', 'green', 'blue', 'white', 'black'];
        recordAction({
            type: 'BUY_CARD',
            payload: {
                card: { ...card, bonusColor: color as any },
                source,
                marketInfo,
                randoms: { bountyHunterColor: basics[Math.floor(Math.random() * 5)] },
            },
        });
    };
    const handleSelectRoyal = (royalCard: any) => {
        if (!canLocalInteract) return;
        recordAction({ type: 'SELECT_ROYAL_CARD', payload: { card: royalCard } });
    };
    const handleCancelReserve = () => {
        if (canLocalInteract) recordAction({ type: 'CANCEL_RESERVE' });
    };
    const handleCancelPrivilege = () => {
        if (canLocalInteract) recordAction({ type: 'CANCEL_PRIVILEGE' });
    };
    const handleUndo = () => {
        if (!gameState?.mode.startsWith('ONLINE') && canUndo) undo();
    };
    const handleRedo = () => {
        if (!gameState?.mode.startsWith('ONLINE') && canRedo) redo();
    };
    const activatePrivilegeMode = () => {
        if (!canLocalInteract || gameState.phase !== 'IDLE') return;
        const hasPrivilege =
            gameState.privileges[gameState.turn] > 0 ||
            (gameState.extraPrivileges && gameState.extraPrivileges[gameState.turn] > 0);
        if (hasPrivilege) {
            if (!gameState.board.flat().some((g) => g.type.id !== 'empty' && g.type.id !== 'gold'))
                return setErrorMsg('No gems.');
            recordAction({ type: 'ACTIVATE_PRIVILEGE' });
            setSelectedGems([]);
        }
    };
    const checkAndInitiateBuyReserved = (card: Card, execute: boolean = false) => {
        if (!canLocalInteract) return false;
        const affordable = canAfford(card);
        if (execute && affordable) initiateBuy(card, 'reserved');
        return affordable;
    };
    const handleDebugAddCrowns = (pid: PlayerKey) => {
        if (!gameState.winner) recordAction({ type: 'DEBUG_ADD_CROWNS', payload: pid });
    };
    const handleDebugAddPoints = (pid: PlayerKey) => {
        if (!gameState.winner) recordAction({ type: 'DEBUG_ADD_POINTS', payload: pid });
    };
    const handleDebugAddPrivilege = (pid: PlayerKey) => {
        if (!gameState.winner) recordAction({ type: 'DEBUG_ADD_PRIVILEGE', payload: pid });
    };
    const handleForceRoyal = () => {
        if (!gameState.winner) recordAction({ type: 'FORCE_ROYAL_SELECTION' });
    };
    const handleSelectBuff = (buffId: string) => {
        if (!canLocalInteract) return;
        const basics = ['red', 'green', 'blue', 'white', 'black'];
        const randomColor = basics[Math.floor(Math.random() * 5)] as GemColor;
        let p2DraftPoolIndices: number[] | undefined;
        if (gameState.turn === 'p1' && gameState.phase === 'DRAFT_PHASE') {
            const levelBuffs = Object.values(BUFFS).filter((b) => b.level === gameState.buffLevel);
            const indices = levelBuffs.map((_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            p2DraftPoolIndices = indices.slice(0, 4);
        }
        recordAction({ type: 'SELECT_BUFF', payload: { buffId, randomColor, p2DraftPoolIndices } });
    };
    const handleCloseModal = () => recordAction({ type: 'CLOSE_MODAL' });
    const handlePeekDeck = (level: number) => {
        if (canLocalInteract) recordAction({ type: 'PEEK_DECK', payload: { level } });
    };

    const safeState = gameState || INITIAL_STATE_SKELETON;
    const boundGetPlayerScore = (pid: PlayerKey) => getPlayerScore(gameState as GameState, pid);
    const boundGetCrownCount = (pid: PlayerKey) => getCrownCount(gameState as GameState, pid);

    return {
        state: { ...safeState, selectedGems, errorMsg },
        handlers: {
            startGame,
            handleSelfGemClick,
            handleGemClick,
            handleOpponentGemClick,
            handleConfirmTake,
            handleReplenish,
            handleReserveCard,
            handleReserveDeck,
            initiateBuy,
            handleSelectBonusColor,
            handleSelectRoyal,
            handleCancelReserve,
            handleCancelPrivilege,
            activatePrivilegeMode,
            checkAndInitiateBuyReserved,
            handleDebugAddCrowns,
            handleDebugAddPoints,
            handleDebugAddPrivilege,
            handleForceRoyal,
            handleSelectBuff,
            handleCloseModal,
            handlePeekDeck,
            importHistory,
        },
        getters: {
            getPlayerScore: boundGetPlayerScore,
            isSelected,
            getCrownCount: boundGetCrownCount,
            canAfford,
            isMyTurn: canLocalInteract,
        },
        historyControls: {
            undo: handleUndo,
            redo: handleRedo,
            canUndo: !gameState?.mode.startsWith('ONLINE') && canUndo,
            canRedo: !gameState?.mode.startsWith('ONLINE') && canRedo,
            currentIndex,
            historyLength: history.length,
            history,
        },
        online,
    };
};
