export const getCardScoreColorClass = (
    color: string | undefined | null,
    theme: 'light' | 'dark'
) => {
    switch (color) {
        case 'blue':
            return 'text-blue-300';
        case 'green':
            return theme === 'dark' ? 'text-emerald-300' : 'text-emerald-400';
        case 'red':
            return theme === 'dark' ? 'text-rose-300' : 'text-rose-500';
        case 'black':
            return theme === 'dark' ? 'text-slate-500' : 'text-black';
        case 'white':
            return 'text-white';
        case 'gold':
            return theme === 'dark' ? 'text-amber-300' : 'text-amber-500';
        case 'null':
        case null:
        case undefined:
            return theme === 'dark' ? 'text-gray-200' : 'text-gray-400';
        default:
            return 'text-white';
    }
};
