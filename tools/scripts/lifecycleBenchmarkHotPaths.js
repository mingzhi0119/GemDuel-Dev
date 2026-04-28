export const buildApplyActionHotPaths = (createMockState, GEM_TYPES) => {
    const buyCardState = createMockState({
        turn: 'p2',
        inventories: {
            p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            p2: { blue: 5, white: 5, green: 5, black: 5, red: 5, gold: 0, pearl: 0 },
        },
        market: {
            1: [
                {
                    id: 'market-high',
                    level: 1,
                    cost: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 0,
                        pearl: 0,
                        gold: 0,
                    },
                    points: 5,
                    bonusColor: 'blue',
                },
            ],
            2: [],
            3: [],
        },
        playerReserved: {
            p1: [],
            p2: [
                {
                    id: 'reserved-low',
                    level: 2,
                    cost: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 0,
                        pearl: 0,
                        gold: 0,
                    },
                    points: 1,
                    bonusColor: 'green',
                },
            ],
        },
    });
    const buyCardAction = {
        type: 'BUY_CARD',
        payload: {
            card: buyCardState.market[1][0],
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
            randoms: { bountyHunterColor: 'red' },
        },
    };

    const takeGemsState = createMockState({
        turn: 'p2',
        inventories: {
            p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
        },
        board: [
            [GEM_TYPES.RED, GEM_TYPES.GREEN, GEM_TYPES.BLUE, GEM_TYPES.EMPTY, GEM_TYPES.EMPTY],
            Array.from({ length: 5 }, () => GEM_TYPES.EMPTY),
            Array.from({ length: 5 }, () => GEM_TYPES.EMPTY),
            Array.from({ length: 5 }, () => GEM_TYPES.EMPTY),
            Array.from({ length: 5 }, () => GEM_TYPES.EMPTY),
        ].map((row, r) =>
            row.map((type, c) => ({
                type,
                uid: `${r}-${c}-${type.id}`,
            }))
        ),
        bag: [],
        market: { 1: [], 2: [], 3: [] },
        playerReserved: { p1: [], p2: [] },
    });
    const takeGemsAction = {
        type: 'TAKE_GEMS',
        payload: {
            coords: [
                { r: 0, c: 0 },
                { r: 0, c: 1 },
                { r: 0, c: 2 },
            ],
        },
    };

    const stealGemState = createMockState({
        phase: 'STEAL_ACTION',
        turn: 'p1',
        inventories: {
            p1: {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                gold: 0,
                pearl: 0,
            },
            p2: {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 2,
                gold: 0,
                pearl: 0,
            },
        },
    });
    const stealGemAction = { type: 'STEAL_GEM', payload: { gemId: 'red' } };

    const closeModalState = createMockState({
        activeModal: {
            type: 'PEEK',
            data: {
                cards: [],
                initiator: 'p1',
            },
        },
    });

    return {
        buyCardState,
        buyCardAction,
        takeGemsState,
        takeGemsAction,
        stealGemState,
        stealGemAction,
        closeModalState,
    };
};
