import { useState, useEffect, useCallback } from 'react';
import { 
    GRID_SIZE, GEM_TYPES, BUFFS 
} from '../constants';
import { generateGemPool, generateDeck, shuffleArray, calculateTransaction } from '../utils';
import { useActionHistory } from './useActionHistory';
import { applyAction } from '../logic/gameReducer';
import { INITIAL_STATE_SKELETON } from '../logic/initialState';
import { validateGemSelection } from '../logic/validators';
import { getPlayerScore, getCrownCount } from '../logic/selectors';

export const useGameLogic = () => {
  // 1. Core State & History
  const { history, currentIndex, recordAction, undo, redo, canUndo, canRedo } = useActionHistory();
  const [gameState, setGameState] = useState(null);
  
  // 2. UI/Transient State (Not in history)
  const [selectedGems, setSelectedGems] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // 3. Initialization Logic
  const startGame = useCallback((options = { useBuffs: false }) => {
      const fullPool = generateGemPool();
      const initialBoardFlat = fullPool.slice(0, 25);
      const initialBag = fullPool.slice(25);
      const newBoard = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        const row = [];
        for (let c = 0; c < GRID_SIZE; c++) { row.push(initialBoardFlat[r * GRID_SIZE + c]); }
        newBoard.push(row);
      }
      const d1 = generateDeck(1); const d2 = generateDeck(2); const d3 = generateDeck(3);
      const market = { 3: d3.splice(0, 3), 2: d2.splice(0, 4), 1: d1.splice(0, 5) };
      const decks = { 1: d1, 2: d2, 3: d3 };
      
      const setupData = { board: newBoard, bag: initialBag, market, decks };

      if (options.useBuffs) {
          const level = Math.floor(Math.random() * 3) + 1;
          const levelBuffs = Object.values(BUFFS).filter(b => b.level === level);
          const draftPool = shuffleArray(levelBuffs).slice(0, 3);
          
          recordAction({ 
              type: 'INIT_DRAFT', 
              payload: { 
                  ...setupData, 
                  draftPool, 
                  buffLevel: level 
              } 
          });
      } else {
          recordAction({ type: 'INIT', payload: setupData });
      }
  }, [recordAction]);

  // 4. Rehydration Engine
  useEffect(() => {
    if (history.length === 0) return;
    let state = null;
    const limit = Math.min(currentIndex, history.length - 1);
    
    for (let i = 0; i <= limit; i++) {
        if (history[i]) state = applyAction(state, history[i]);
    }
    setGameState(state);
  }, [currentIndex, history]);

  // --- Helpers & Getters ---
  const getGemAt = (r, c) => (gameState && gameState.board && gameState.board[r] && gameState.board[r][c]) ? gameState.board[r][c] : null;
  const isSelected = (r, c) => selectedGems.some(s => s.r === r && s.c === c);
  
  const canAfford = useCallback((card) => {
    if (!gameState) return false;
    const player = gameState.turn;
    const { affordable } = calculateTransaction(
        card, 
        gameState.inventories[player], 
        gameState.playerTableau[player], 
        gameState.playerBuffs?.[player]
    );
    return affordable;
  }, [gameState]);

  // --- Handlers (Now dispatch actions) ---
  const handleSelfGemClick = (gemId) => {
      if (!gameState || gameState.gameMode !== 'DISCARD_EXCESS_GEMS') return;
      if (gameState.winner) return;
      
      const inv = { ...gameState.inventories[gameState.turn] };
      if (inv[gemId] > 0) {
          recordAction({ type: 'DISCARD_GEM', payload: gemId });
      }
  };

  const handleGemClick = (r, c) => {
    if (!gameState) return;
    const gem = getGemAt(r, c);
    if (gameState.winner) return;
    if (!gem || !gem.type || gem.type.id === 'empty') return;

    if (gameState.gameMode === 'BONUS_ACTION') {
        if (gem.type.id !== gameState.bonusGemTarget) { setErrorMsg(`Must select a ${gameState.bonusGemTarget} gem!`); return; }
        recordAction({ type: 'TAKE_BONUS_GEM', payload: { r, c } });
        return;
    }

    if (gameState.gameMode === 'RESERVE_WAITING_GEM') {
        if (gem.type.id !== 'gold') { setErrorMsg("Must select a Gold gem!"); return; }
        
        if (gameState.pendingReserve.isDeck) {
             recordAction({ type: 'RESERVE_DECK', payload: { ...gameState.pendingReserve, goldCoords: { r, c } } });
        } else {
             recordAction({ type: 'RESERVE_CARD', payload: { ...gameState.pendingReserve, goldCoords: { r, c } } });
        }
        return;
    }

    if (gameState.gameMode === 'PRIVILEGE_ACTION') {
        if (gem.type.id === 'gold') { setErrorMsg("Cannot use Privilege on Gold."); return; }
        recordAction({ type: 'USE_PRIVILEGE', payload: { r, c } });
        return;
    }

    if (gameState.gameMode !== 'IDLE') return;

    if (isSelected(r, c)) {
      setSelectedGems(selectedGems.filter(g => g.r !== r || g.c !== c));
      return;
    }

    if (gem.type.id === 'gold') { setErrorMsg("Cannot take Gold directly!"); return; }
    
    const newSelection = [...selectedGems, { r, c }];
    if (newSelection.length > 3) { setErrorMsg("Max 3 gems."); return; }

    const check = validateGemSelection(newSelection);
    if (!check.valid) {
        setErrorMsg(check.error);
        return;
    }
    setSelectedGems(newSelection);
  };

  const handleOpponentGemClick = (gemId) => {
      if (!gameState || gameState.winner) return;
      if (gameState.gameMode !== 'STEAL_ACTION') return;
      
      if (gemId === 'gold') {
          setErrorMsg("Cannot steal Gold!");
          return;
      }
      
      const opponent = gameState.turn === 'p1' ? 'p2' : 'p1';
      if (gameState.inventories[opponent][gemId] > 0) {
          recordAction({ type: 'STEAL_GEM', payload: { gemId } });
      }
  };

  const handleConfirmTake = () => {
    if (selectedGems.length === 0) return;
    if (gameState.winner) return;
    const check = validateGemSelection(selectedGems);
    if (check.hasGap) { setErrorMsg("Cannot take with gaps! Fill the middle."); return; }
    
    // High Roller restriction
    const buff = gameState.playerBuffs?.[gameState.turn];
    if (buff?.effects?.passive?.noTake3 && selectedGems.length === 3) {
        setErrorMsg("High Roller: Cannot take 3 gems!");
        return;
    }

    recordAction({ type: 'TAKE_GEMS', payload: { coords: selectedGems } });
    setSelectedGems([]); 
  };

  const handleReplenish = () => {
    if (gameState.winner) return;
    if (gameState.bag.length === 0) { setErrorMsg("Bag empty!"); return; }
    
    // Pre-calculate randoms for Extortion/Expansion
    const randoms = {};
    const basics = ['red', 'green', 'blue', 'white', 'black'];
    
    // Expansion
    randoms.expansionColor = basics[Math.floor(Math.random() * basics.length)];
    
    // Extortion (needs state access)
    const opponent = gameState.turn === 'p1' ? 'p2' : 'p1';
    const stealableColors = Object.keys(gameState.inventories[opponent])
        .filter(k => k !== 'gold' && k !== 'pearl' && gameState.inventories[opponent][k] > 0);
    if (stealableColors.length > 0) {
        randoms.extortionColor = stealableColors[Math.floor(Math.random() * stealableColors.length)];
    }

    recordAction({ type: 'REPLENISH', payload: { randoms } });
  };

  const handleReserveCard = (card, level, idx) => {
      if (gameState.winner) return;
      if (gameState.playerReserved[gameState.turn].length >= 3) {
          setErrorMsg("Reserve full (max 3).");
          return;
      }
      
      // Check for gold on board
      let hasGold = false;
      for(let r=0; r<GRID_SIZE; r++) {
          for(let c=0; c<GRID_SIZE; c++) {
              if (gameState.board[r][c].type.id === 'gold') {
                  hasGold = true;
                  break;
              }
          }
          if(hasGold) break;
      }

      if (hasGold) {
          recordAction({ type: 'INITIATE_RESERVE', payload: { card, level, idx } });
          setErrorMsg("Select a Gold gem to take.");
      } else {
          recordAction({ type: 'RESERVE_CARD', payload: { card, level, idx } });
      }
  };
  
  const handleReserveDeck = (level) => {
      if (gameState.winner) return;
      if (gameState.playerReserved[gameState.turn].length >= 3) {
          setErrorMsg("Reserve full (max 3).");
          return;
      }
      if (gameState.decks[level].length === 0) {
          setErrorMsg("Deck empty!");
          return;
      }

      let hasGold = false;
      for(let r=0; r<GRID_SIZE; r++) {
          for(let c=0; c<GRID_SIZE; c++) {
              if (gameState.board[r][c].type.id === 'gold') {
                  hasGold = true;
                  break;
              }
          }
          if(hasGold) break;
      }

      const actionType = hasGold ? 'INITIATE_RESERVE_DECK' : 'RESERVE_DECK';
      recordAction({ type: actionType, payload: { level } });
  };

  const initiateBuy = (card, source = 'market', marketInfo = {}) => {
      if (gameState.winner) return;
      
      const affordable = canAfford(card);

      if (card.bonusColor === 'gold') {
          if (affordable) {
              recordAction({ type: 'INITIATE_BUY_JOKER', payload: { card, source, marketInfo } });
          } else {
              setErrorMsg("Cannot afford this card!");
          }
          return;
      }

      if (affordable) {
          const basics = ['red', 'green', 'blue', 'white', 'black'];
          const randoms = {
              bountyHunterColor: basics[Math.floor(Math.random() * basics.length)]
          };
          recordAction({ type: 'BUY_CARD', payload: { card, source, marketInfo, randoms } });
      } else {
          setErrorMsg("Cannot afford this card!");
      }
  };

  const handleSelectBonusColor = (color) => {
      if (!gameState || gameState.gameMode !== 'SELECT_CARD_COLOR' || !gameState.pendingBuy) return;
      const { card, source, marketInfo } = gameState.pendingBuy;
      const modifiedCard = { ...card, bonusColor: color };
      
      const basics = ['red', 'green', 'blue', 'white', 'black'];
      const randoms = {
          bountyHunterColor: basics[Math.floor(Math.random() * basics.length)]
      };

      recordAction({ type: 'BUY_CARD', payload: { card: modifiedCard, source, marketInfo, randoms } });
  };

  const handleSelectRoyal = (royalCard) => {
      if (gameState.winner) return;
      recordAction({ type: 'SELECT_ROYAL_CARD', payload: { card: royalCard } });
  };

  const handleCancelReserve = () => { 
      if (gameState.winner) return;
      recordAction({ type: 'CANCEL_RESERVE' });
  };
  const activatePrivilegeMode = () => {
      if (!gameState || gameState.winner) return;
      if (gameState.gameMode !== 'IDLE') return;
      
      if (gameState.privileges[gameState.turn] > 0) {
          const hasNonGold = gameState.board.some(row => row.some(g => g.type.id !== 'empty' && g.type.id !== 'gold'));
          if (!hasNonGold) { setErrorMsg("No gems available."); return; }
          
          recordAction({ type: 'ACTIVATE_PRIVILEGE' });
          setSelectedGems([]);
      }
  };
  const checkAndInitiateBuyReserved = (card, execute = false) => { 
      if (!gameState) return false;
      if (gameState.winner) return false;
      const affordable = canAfford(card);
      if (execute && affordable) initiateBuy(card, 'reserved'); 
      return affordable; 
  };

  const handleDebugAddCrowns = (pid) => {
      if (gameState.winner) return;
      recordAction({ type: 'DEBUG_ADD_CROWNS', payload: pid });
  };

  const handleDebugAddPoints = (pid) => {
      if (gameState.winner) return;
      recordAction({ type: 'DEBUG_ADD_POINTS', payload: pid });
  };

  const handleForceRoyal = () => {
      if (gameState.winner) return;
      recordAction({ type: 'FORCE_ROYAL_SELECTION' });
  };

  const handleSelectBuff = (buffId) => {
      const basics = ['red', 'green', 'blue', 'white', 'black'];
      const randomColor = basics[Math.floor(Math.random() * basics.length)];
      
      let initRandoms = {};
      if (gameState && gameState.turn === 'p1') {
          initRandoms = {
              p1: { 
                  randomGems: Array.from({length: 5}, () => basics[Math.floor(Math.random() * basics.length)]),
                  reserveCardLevel: Math.floor(Math.random() * 3) + 1
              },
              p2: {
                  randomGems: Array.from({length: 5}, () => basics[Math.floor(Math.random() * basics.length)]),
                  reserveCardLevel: Math.floor(Math.random() * 3) + 1
              }
          };
      }
      recordAction({ type: 'SELECT_BUFF', payload: { buffId, randomColor, initRandoms } });
  };

  const handleCloseModal = () => {
      recordAction({ type: 'CLOSE_MODAL' });
  };

  const handlePeekDeck = (level) => {
      recordAction({ type: 'PEEK_DECK', payload: { level } });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setErrorMsg(null), 2000);
    return () => clearTimeout(timeout);
  }, [errorMsg]);
  
  useEffect(() => {
    if (gameState?.toastMessage) {
      setErrorMsg(gameState.toastMessage);
    }
  }, [gameState?.toastMessage]);

  const safeState = gameState || INITIAL_STATE_SKELETON;

  // Wrapped Getters
  const boundGetPlayerScore = (pid) => getPlayerScore(gameState, pid);
  const boundGetCrownCount = (pid) => getCrownCount(gameState, pid);

  return {
    state: { ...safeState, selectedGems, errorMsg },
    handlers: { startGame, handleSelfGemClick, handleGemClick, handleOpponentGemClick, handleConfirmTake, handleReplenish, handleReserveCard, handleReserveDeck, initiateBuy, handleSelectBonusColor, handleSelectRoyal, handleCancelReserve, activatePrivilegeMode, checkAndInitiateBuyReserved, handleDebugAddCrowns, handleDebugAddPoints, handleForceRoyal, handleSelectBuff, handleCloseModal, handlePeekDeck },
    getters: { 
        getPlayerScore: boundGetPlayerScore, 
        isSelected, 
        getCrownCount: boundGetCrownCount, 
        canAfford 
    },
    historyControls: { undo, redo, canUndo, canRedo, currentIndex, historyLength: history.length }
  };
};
