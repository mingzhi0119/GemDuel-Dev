import { useState, useEffect, useCallback } from 'react';
import { 
    GRID_SIZE, GEM_TYPES, BONUS_COLORS, SPIRAL_ORDER, ABILITIES, ROYAL_CARDS 
} from '../constants';
import { generateGemPool, generateDeck, calculateCost } from '../utils';
import { useUndo } from './useUndo';

export const useGameLogic = () => {
  const [board, setBoard] = useState([]);
  const [bag, setBag] = useState([]);
  const [turn, setTurn] = useState('p1');
  const [selectedGems, setSelectedGems] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState('IDLE');
  const [pendingReserve, setPendingReserve] = useState(null);
  const [bonusGemTarget, setBonusGemTarget] = useState(null);
  const [pendingBuy, setPendingBuy] = useState(null); 
  const [nextPlayerAfterRoyal, setNextPlayerAfterRoyal] = useState(null);
  const [decks, setDecks] = useState({ 1: [], 2: [], 3: [] });
  const [market, setMarket] = useState({ 1: [], 2: [], 3: [] });
  const [inventories, setInventories] = useState({
    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
  });
  const [privileges, setPrivileges] = useState({ p1: 0, p2: 1 });
  const [playerTableau, setPlayerTableau] = useState({ p1: [], p2: [] });
  const [playerReserved, setPlayerReserved] = useState({ p1: [], p2: [] });
  const [royalDeck, setRoyalDeck] = useState(ROYAL_CARDS);
  const [playerRoyals, setPlayerRoyals] = useState({ p1: [], p2: [] });
  const [royalMilestones, setRoyalMilestones] = useState({
      p1: { 3: false, 6: false },
      p2: { 3: false, 6: false }
  });

  const restoreState = (prevState) => {
    setBoard(prevState.board);
    setBag(prevState.bag);
    setTurn(prevState.turn);
    setGameMode(prevState.gameMode);
    setSelectedGems(prevState.selectedGems);
    setPendingReserve(prevState.pendingReserve);
    setPendingBuy(prevState.pendingBuy);
    setBonusGemTarget(prevState.bonusGemTarget);
    setNextPlayerAfterRoyal(prevState.nextPlayerAfterRoyal);
    setDecks(prevState.decks);
    setMarket(prevState.market);
    setInventories(prevState.inventories);
    setPrivileges(prevState.privileges);
    setPlayerTableau(prevState.playerTableau);
    setPlayerReserved(prevState.playerReserved);
    setRoyalDeck(prevState.royalDeck);
    setPlayerRoyals(prevState.playerRoyals);
    setRoyalMilestones(prevState.royalMilestones);
    setWinner(null);
  };
  
  const { historyStack, saveState, handleUndo, undoMessage } = useUndo(restoreState);

  const getCurrentState = () => ({
    board, bag, turn, selectedGems, gameMode, pendingReserve, bonusGemTarget,
    pendingBuy, nextPlayerAfterRoyal, decks, market, inventories, privileges,
    playerTableau, playerReserved, royalDeck, playerRoyals, royalMilestones,
  });

  const beforeAction = () => saveState(getCurrentState());
  
  // --- Init ---
  useEffect(() => {
    const fullPool = generateGemPool();
    const initialBoardFlat = fullPool.slice(0, 25);
    const initialBag = fullPool.slice(25); 

    const newBoard = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        row.push(initialBoardFlat[r * GRID_SIZE + c]);
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setBag(initialBag);

    const d1 = generateDeck(1);
    const d2 = generateDeck(2);
    const d3 = generateDeck(3);
    setMarket({ 3: d3.splice(0, 3), 2: d2.splice(0, 4), 1: d1.splice(0, 5) });
    setDecks({ 1: d1, 2: d2, 3: d3 });
  }, []);

  const getGemAt = (r, c) => (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) ? board[r][c] : null;
  const isSelected = (r, c) => selectedGems.some(s => s.r === r && s.c === c);
  
  const getPlayerScore = (pid) => {
      const cardPoints = playerTableau[pid].reduce((acc, c) => acc + c.points, 0);
      const royalPoints = playerRoyals[pid].reduce((acc, c) => acc + c.points, 0);
      return cardPoints + royalPoints;
  };

  const getCrownCount = (pid) => {
      const allCards = [...playerTableau[pid], ...playerRoyals[pid]];
      return allCards.reduce((acc, c) => acc + (c.crowns || 0), 0);
  };

  const validateGemSelection = (gems) => {
    if (gems.length <= 1) return { valid: true, hasGap: false };
    const sorted = [...gems].sort((a, b) => a.r - b.r || a.c - b.c);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const dr = last.r - first.r;
    const dc = last.c - first.c;
    const isRow = dr === 0;
    const isCol = dc === 0;
    const isDiag = Math.abs(dr) === Math.abs(dc);
    if (!isRow && !isCol && !isDiag) return { valid: false, error: "Must be in a straight line." };
    const span = Math.max(Math.abs(dr), Math.abs(dc));
    if (span > 2) return { valid: false, error: "Too far apart (Max 3 gems)." };
    if (sorted.length === 3) {
        const mid = sorted[1];
        if (mid.r * 2 !== first.r + last.r || mid.c * 2 !== first.c + last.c) {
            return { valid: false, error: "Gems must be contiguous." };
        }
    }
    const hasGap = (sorted.length === 2 && span === 2);
    return { valid: true, hasGap, error: null };
  };

  const performTakePrivilege = (targetPlayer) => {
    const opponent = targetPlayer === 'p1' ? 'p2' : 'p1';
    const totalInPlay = privileges.p1 + privileges.p2;
    let newPrivs = { ...privileges };
    let msg = "";

    if (totalInPlay < 3) {
        newPrivs[targetPlayer]++;
        msg = "Took a Privilege Scroll.";
    } else {
        if (newPrivs[opponent] > 0) {
            newPrivs[opponent]--;
            newPrivs[targetPlayer]++;
            msg = "Stole a Privilege from opponent!";
        } else {
            msg = "No Privileges available.";
        }
    }
    setPrivileges(newPrivs);
    return msg;
  };

  const giveOpponentPrivilege = () => {
      const opponent = turn === 'p1' ? 'p2' : 'p1';
      return performTakePrivilege(opponent);
  };

  const finalizeTurn = (nextPlayer, instantInv = null) => {
      const getPointsByColor = (pid, color) => playerTableau[pid].filter(c => c.bonusColor === color).reduce((acc, c) => acc + c.points, 0);
      const currentScore = getPlayerScore(turn);
      const currentCrowns = getCrownCount(turn);
      
      if (currentScore >= 20) { setWinner(turn); return; }
      if (currentCrowns >= 10) { setWinner(turn); return; }
      for (const color of BONUS_COLORS) {
          if (getPointsByColor(turn, color) >= 10) { setWinner(turn); return; }
      }

      const invToCheck = instantInv || inventories[turn];
      const totalGems = Object.values(invToCheck).reduce((a, b) => a + b, 0);
      
      if (totalGems > 10) {
          setGameMode('DISCARD_EXCESS_GEMS');
          setErrorMsg(`Limit 10 gems! Discard ${totalGems - 10} more.`);
          if (!nextPlayerAfterRoyal) setNextPlayerAfterRoyal(nextPlayer); 
          return;
      }

      setTurn(nextPlayer);
      setGameMode('IDLE');
      setNextPlayerAfterRoyal(null);
  };

  const handleSelfGemClick = (gemId) => {
      if (gameMode !== 'DISCARD_EXCESS_GEMS') return;
      
      const inv = { ...inventories[turn] };
      if (inv[gemId] > 0) {
          inv[gemId]--;
          const gemsToReturn = [{ type: GEM_TYPES[gemId.toUpperCase()], uid: `discard-${Date.now()}` }];
          
          setInventories({ ...inventories, [turn]: inv });
          setBag(prev => [...prev, ...gemsToReturn]);

          const totalGems = Object.values(inv).reduce((a, b) => a + b, 0);
          if (totalGems <= 10) {
              setErrorMsg(null);
              const nextP = nextPlayerAfterRoyal || (turn === 'p1' ? 'p2' : 'p1');
              setTurn(nextP);
              setGameMode('IDLE');
              setNextPlayerAfterRoyal(null);
          } else {
              setErrorMsg(`Limit 10 gems! Discard ${totalGems - 10} more.`);
          }
      }
  };

  const handleGemClick = (r, c) => {
    const gem = getGemAt(r, c);
    if (!gem || !gem.type || gem.type.id === 'empty') return;

    if (gameMode === 'BONUS_ACTION') {
        if (gem.type.id !== bonusGemTarget) { setErrorMsg(`Must select a ${bonusGemTarget} gem!`); return; }
        beforeAction();
        const newBoard = [...board]; newBoard[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
        const newInv = { ...inventories, [turn]: {...inventories[turn], [gem.type.id]: inventories[turn][gem.type.id] + 1 }};
        setBoard(newBoard); 
        setInventories(newInv);
        const nextP = nextPlayerAfterRoyal || (turn === 'p1' ? 'p2' : 'p1');
        finalizeTurn(nextP, newInv[turn]); 
        return;
    }

    if (gameMode === 'PRIVILEGE_ACTION') {
        if (gem.type.id === 'gold') { setErrorMsg("Cannot use Privilege on Gold."); return; }
        beforeAction();
        const newBoard = [...board]; newBoard[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
        const newInv = { ...inventories, [turn]: {...inventories[turn], [gem.type.id]: inventories[turn][gem.type.id] + 1 }};
        const newPrivs = { ...privileges, [turn]: privileges[turn] - 1 };
        setBoard(newBoard); setInventories(newInv); setPrivileges(newPrivs);
        setGameMode('IDLE');
        return;
    }

    if (gameMode === 'RESERVE_WAITING_GEM') {
      if (gem.type.id !== 'gold') { setErrorMsg("Must select a Gold gem!"); return; }
      if (pendingReserve.type === 'market') {
          executeReserve(pendingReserve.card, pendingReserve.level, pendingReserve.idx, true, { r, c });
      } else if (pendingReserve.type === 'deck') {
          executeReserveFromDeck(pendingReserve.level, true, { r, c });
      }
      return;
    }

    if (gameMode !== 'IDLE') return;

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
      if (gameMode !== 'STEAL_ACTION') return;
      const opponent = turn === 'p1' ? 'p2' : 'p1';
      if (inventories[opponent][gemId] > 0) {
          beforeAction();
          const newPlayerInv = {...inventories[turn], [gemId]: inventories[turn][gemId] + 1};
          const newOpponentInv = {...inventories[opponent], [gemId]: inventories[opponent][gemId] - 1};
          setInventories({ ...inventories, [turn]: newPlayerInv, [opponent]: newOpponentInv });
          setErrorMsg(`Stole a ${gemId} gem!`);
          const nextP = nextPlayerAfterRoyal || (turn === 'p1' ? 'p2' : 'p1');
          finalizeTurn(nextP, newPlayerInv);
      }
  };

  const handleConfirmTake = () => {
    if (selectedGems.length === 0) return;
    const check = validateGemSelection(selectedGems);
    if (check.hasGap) { setErrorMsg("Cannot take with gaps! Fill the middle."); return; }
    beforeAction();
    const newBoard = board.map(row => [...row]);
    const newInv = { ...inventories[turn] };
    let pearlCount = 0; let colorCounts = {}; let triggerPrivilege = false;
    selectedGems.forEach(({ r, c }) => {
      const gem = newBoard[r][c];
      const type = gem.type.id;
      newInv[type] = (newInv[type] || 0) + 1;
      newBoard[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` }; 
      if (type === 'pearl') pearlCount++;
      colorCounts[type] = (colorCounts[type] || 0) + 1;
    });
    if (pearlCount >= 2 || Object.values(colorCounts).some(count => count >= 3)) {
        const msg = giveOpponentPrivilege();
        setErrorMsg(msg);
    }
    setBoard(newBoard); 
    setInventories({ ...inventories, [turn]: newInv }); 
    setSelectedGems([]); 
    finalizeTurn(turn === 'p1' ? 'p2' : 'p1', newInv);
  };

  const handleReplenish = () => {
    if (bag.length === 0) { setErrorMsg("Bag empty!"); return; }
    beforeAction();
    const isBoardEmpty = board.every(row => row.every(g => g.type.id === 'empty'));
    let msg = "";
    if (!isBoardEmpty) { msg = giveOpponentPrivilege(); }
    const newBoard = board.map(row => [...row]); const newBag = [...bag]; let filled = 0;
    for (let i = 0; i < SPIRAL_ORDER.length; i++) {
        const [r, c] = SPIRAL_ORDER[i];
        if (newBoard[r][c].type.id === 'empty' && newBag.length > 0) { newBoard[r][c] = newBag.pop(); filled++; }
    }
    setBoard(newBoard); setBag(newBag); if(filled > 0) { setErrorMsg(`Refilled ${filled}. ${msg}`); }
  };

  const handleReserveCard = (card, level, idx) => {
      if (playerReserved[turn].length >= 3) { setErrorMsg("Reserve full (max 3)."); return; }
      beforeAction();
      const goldExists = board.some(row => row.some(g => g.type.id === 'gold'));
      if (goldExists) { 
          setPendingReserve({ type: 'market', card, level, idx }); 
          setGameMode('RESERVE_WAITING_GEM'); 
          setErrorMsg("Reserving... Pick a Gold gem to confirm."); 
      }
      else { executeReserve(card, level, idx, false); }
  };
  
  const executeReserve = (card, level, idx, takeGold, goldCoords = null) => {
      setPlayerReserved(prev => ({ ...prev, [turn]: [...prev[turn], card] }));
      const newDecks = { ...decks, [level]: [...decks[level]] };
      const newMarket = { ...market };
      if (newDecks[level].length > 0) newMarket[level][idx] = newDecks[level].pop(); else newMarket[level][idx] = null;
      setMarket(newMarket); setDecks(newDecks);
      let newInv = { ...inventories[turn] };
      if (takeGold && goldCoords) {
          const { r, c } = goldCoords; const newBoard = [...board]; newBoard[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` }; setBoard(newBoard);
          newInv.gold += 1; 
          setInventories(prev => ({ ...prev, [turn]: newInv }));
      }
      setPendingReserve(null); setGameMode('IDLE'); 
      setErrorMsg(takeGold ? "Reserved & Took Gold." : "Reserved (No Gold Available).");
      finalizeTurn(turn === 'p1' ? 'p2' : 'p1', newInv);
  };

  const handleReserveDeck = (level) => {
      if (gameMode !== 'IDLE' || decks[level].length === 0 || playerReserved[turn].length >= 3) {
        if (decks[level].length === 0) setErrorMsg("Deck empty!");
        if (playerReserved[turn].length >= 3) setErrorMsg("Reserve full (max 3).");
        return;
      }
      beforeAction();
      const goldExists = board.some(row => row.some(g => g.type.id === 'gold'));
      if (goldExists) {
          setPendingReserve({ type: 'deck', level });
          setGameMode('RESERVE_WAITING_GEM');
          setErrorMsg("Reserving Top Card... Pick a Gold gem.");
      } else {
          executeReserveFromDeck(level, false);
      }
  };

  const executeReserveFromDeck = (level, takeGold, goldCoords = null) => {
      const newDecks = { ...decks };
      const card = newDecks[level].pop();
      setDecks(newDecks);
      setPlayerReserved(prev => ({ ...prev, [turn]: [...prev[turn], card] }));
      let newInv = { ...inventories[turn] };
      if (takeGold && goldCoords) {
          const { r, c } = goldCoords; 
          const newBoard = [...board]; 
          newBoard[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` }; 
          setBoard(newBoard);
          newInv.gold += 1; 
          setInventories(prev => ({ ...prev, [turn]: newInv }));
      }
      setPendingReserve(null); 
      setGameMode('IDLE');
      setErrorMsg(takeGold ? "Reserved Top Deck & Took Gold." : "Reserved Top Deck (No Gold).");
      finalizeTurn(turn === 'p1' ? 'p2' : 'p1', newInv);
  };

  const initiateBuy = (card, source = 'market', marketInfo = {}) => {
      if (!calculateCost(card, turn, inventories, playerTableau)) { setErrorMsg("Cannot afford this card."); return; }
      beforeAction();
      if (card.bonusColor === 'gold') { setPendingBuy({ card, source, marketInfo }); setGameMode('SELECT_CARD_COLOR'); setErrorMsg("Select a color for this Joker."); return; }
      executeBuy(card, source, marketInfo);
  };

  const handleSelectBonusColor = (color) => {
      if (!pendingBuy) return;
      const modifiedCard = { ...pendingBuy.card, bonusColor: color };
      executeBuy(modifiedCard, pendingBuy.source, pendingBuy.marketInfo);
      setPendingBuy(null); setGameMode('IDLE');
  };

  const handleSelectRoyal = (royalCard) => {
      if (!royalCard) return;
      setRoyalDeck(prev => prev.filter(c => c.id !== royalCard.id));
      setPlayerRoyals(prev => ({ ...prev, [turn]: [...prev[turn], royalCard] }));
      let nextTurnPlayer = nextPlayerAfterRoyal; 
      if (royalCard.ability === ABILITIES.AGAIN.id) { setErrorMsg("ROYAL: Play Again!"); nextTurnPlayer = turn; } 
      else if (royalCard.ability === ABILITIES.STEAL.id) {
           const opponent = turn === 'p1' ? 'p2' : 'p1';
           const hasGems = Object.keys(inventories[opponent]).some(k => k !== 'gold' && inventories[opponent][k] > 0);
           if (hasGems) { setGameMode('STEAL_ACTION'); setErrorMsg("ROYAL: Steal! Click an opponent's gem."); setNextPlayerAfterRoyal(nextTurnPlayer); return; }
      }
      else if (royalCard.ability === ABILITIES.SCROLL.id) { performTakePrivilege(turn); setErrorMsg("ROYAL: Took Privilege."); }
      setGameMode('IDLE');
      finalizeTurn(nextTurnPlayer);
  };

  const executeBuy = (card, source = 'market', marketInfo = {}) => {
      const inv = inventories[turn];
      const newInv = { ...inv };
      const bonuses = BONUS_COLORS.reduce((acc, color) => ({ ...acc, [color]: playerTableau[turn].filter(c => c.bonusColor === color).reduce((sum, c) => sum + (c.bonusCount || 1), 0) }), {});
      let goldCost = 0; const gemsToReturn = [];
      Object.entries(card.cost).forEach(([color, cost]) => {
          const needed = Math.max(0, cost - (bonuses[color] || 0));
          const paidAmt = Math.min(needed, newInv[color]);
          newInv[color] -= paidAmt;
          goldCost += (needed - paidAmt);
          for(let k=0; k < paidAmt; k++) { gemsToReturn.push({ type: GEM_TYPES[color.toUpperCase()], uid: `returned-${color}-${Date.now()}-${k}` }); }
      });
      newInv.gold -= goldCost;
      for(let k=0; k < goldCost; k++) { gemsToReturn.push({ type: GEM_TYPES.GOLD, uid: `returned-gold-${Date.now()}-${k}` }); }
      setInventories({ ...inventories, [turn]: newInv });
      const newTableau = [...playerTableau[turn], card];
      setPlayerTableau({ ...playerTableau, [turn]: newTableau });
      setBag(prev => [...prev, ...gemsToReturn]);
      if (source === 'market') {
          const newMarket = {...market}; const { level, idx } = marketInfo;
          if (decks[level].length > 0) newMarket[level][idx] = decks[level].pop(); else newMarket[level][idx] = null;
          setMarket(newMarket);
      } else if (source === 'reserved') {
          setPlayerReserved({ ...playerReserved, [turn]: playerReserved[turn].filter(c => c.id !== card.id) });
      }
      let nextTurn = turn === 'p1' ? 'p2' : 'p1'; 
      let abilityMode = null;
      if (card.ability) {
          const abils = Array.isArray(card.ability) ? card.ability : [card.ability];
          for(const abil of abils) {
              if (abil === ABILITIES.AGAIN.id) nextTurn = turn; 
              if (abil === ABILITIES.SCROLL.id) performTakePrivilege(turn);
              if (abil === ABILITIES.STEAL.id) abilityMode = 'STEAL_ACTION';
              if (abil === ABILITIES.BONUS_GEM.id) {
                   if (board.some(row => row.some(g => g.type.id === card.bonusColor))) { abilityMode = 'BONUS_ACTION'; setBonusGemTarget(card.bonusColor); }
              }
          }
      }
      const currentCrowns = [...newTableau, ...playerRoyals[turn]].reduce((acc, c) => acc + (c.crowns || 0), 0);
      const myMilestones = royalMilestones[turn];
      let triggerRoyal = false;
      if (currentCrowns >= 3 && !myMilestones[3]) { triggerRoyal = true; setRoyalMilestones(prev => ({ ...prev, [turn]: { ...prev[turn], 3: true } })); }
      else if (currentCrowns >= 6 && !myMilestones[6]) { triggerRoyal = true; setRoyalMilestones(prev => ({ ...prev, [turn]: { ...prev[turn], 6: true } })); }

      if (triggerRoyal && royalDeck.length > 0) { setNextPlayerAfterRoyal(nextTurn); setGameMode('SELECT_ROYAL'); setErrorMsg("Crown Milestone Reached! Choose a Royal Card."); return; }
      if (abilityMode) {
          setGameMode(abilityMode);
          if (abilityMode === 'STEAL_ACTION') setErrorMsg("ABILITY: Steal! Click opponent's gem.");
          if (abilityMode === 'BONUS_ACTION') setErrorMsg(`ABILITY: Take 1 ${card.bonusColor} gem.`);
          setNextPlayerAfterRoyal(nextTurn);
      } else { finalizeTurn(nextTurn, newInv); }
  };

  const handleCancelReserve = () => { setPendingReserve(null); setGameMode('IDLE'); setErrorMsg("Reserve cancelled."); };
  const activatePrivilegeMode = () => { if (privileges[turn] > 0) { setGameMode('PRIVILEGE_ACTION'); setSelectedGems([]); } };
  const handleSkipAction = () => {
    setGameMode('IDLE');
    setTurn(turn === 'p1' ? 'p2' : 'p1');
  };
  const checkAndInitiateBuyReserved = (card, execute = false) => { if (execute && calculateCost(card, turn, inventories, playerTableau)) initiateBuy(card, 'reserved'); return calculateCost(card, turn, inventories, playerTableau); };

  const handleDebugAddCrowns = (pid) => {
      beforeAction();
      const newCard = { id: `debug-${Date.now()}`, crowns: 3, points: 0, cost: {}, bonusColor: 'white' };
      const newTableau = [...playerTableau[pid], newCard];
      setPlayerTableau(prev => ({ ...prev, [pid]: newTableau }));
      const allCards = [...newTableau, ...playerRoyals[pid]];
      const crowns = allCards.reduce((acc, c) => acc + (c.crowns || 0), 0);
      if (crowns >= 10) { setWinner(pid); return; }
      const milestones = royalMilestones[pid];
      if ((crowns >= 3 && !milestones[3]) || (crowns >= 6 && !milestones[6])) {
          setRoyalMilestones(prev => ({ ...prev, [pid]: { ...prev[pid], [crowns >= 6 ? 6 : 3]: true } }));
          if (royalDeck.length > 0) { setGameMode('SELECT_ROYAL'); setNextPlayerAfterRoyal(turn); setErrorMsg(`Debug: ${pid} Royal Milestone!`); }
      }
  };

  const handleDebugAddPoints = (pid) => {
      beforeAction();
      const newRoyal = { id: `debug-pt-${Date.now()}`, points: 10, crowns: 0, ability: 'none' };
      const newRoyals = [...playerRoyals[pid], newRoyal];
      setPlayerRoyals(prev => ({ ...prev, [pid]: newRoyals }));
      if ([...playerTableau[pid], ...newRoyals].reduce((acc, c) => acc + c.points, 0) >= 20) { setWinner(pid); }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setErrorMsg(null), 2000);
    return () => clearTimeout(timeout);
  }, [errorMsg]);
  
  return {
    state: { board, bag, turn, selectedGems, errorMsg: undoMessage || errorMsg, winner, gameMode, pendingReserve, bonusGemTarget, pendingBuy, nextPlayerAfterRoyal, decks, market, inventories, privileges, playerTableau, playerReserved, royalDeck, playerRoyals, royalMilestones },
    handlers: { handleSelfGemClick, handleGemClick, handleOpponentGemClick, handleConfirmTake, handleReplenish, handleReserveCard, handleReserveDeck, initiateBuy, handleSelectBonusColor, handleSelectRoyal, handleCancelReserve, activatePrivilegeMode, checkAndInitiateBuyReserved, handleDebugAddCrowns, handleDebugAddPoints, handleUndo, setGameMode, setNextPlayerAfterRoyal, handleSkipAction },
    getters: { getPlayerScore, isSelected, getCrownCount },
    historyStack
  };
};
