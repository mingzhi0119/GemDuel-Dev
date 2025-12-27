export const validateGemSelection = (gems) => {
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
