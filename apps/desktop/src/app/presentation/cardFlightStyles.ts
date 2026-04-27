export const CARD_FLIGHT_STYLES = `
@keyframes gemduel-card-flight {
    0% { opacity: 0; transform: translate3d(var(--start-x), var(--start-y), 0) scale(0.86) rotate(-4deg); }
    22% { opacity: 1; }
    72% { opacity: 1; transform: translate3d(var(--mid-x), var(--mid-y), 0) scale(1.05) rotate(3deg); }
    100% { opacity: 0; transform: translate3d(var(--end-x), var(--end-y), 0) scale(0.78) rotate(0deg); }
}
@keyframes gemduel-card-flight-reduced {
    0% { opacity: 0; transform: translate3d(var(--end-x), var(--end-y), 0) scale(0.96); }
    45% { opacity: 0.88; transform: translate3d(var(--end-x), var(--end-y), 0) scale(1.04); }
    100% { opacity: 0; transform: translate3d(var(--end-x), var(--end-y), 0) scale(1); }
}
@keyframes gemduel-market-refill-flip {
    0% { opacity: 0; transform: rotateY(-74deg) scale(0.94); }
    34% { opacity: 0.95; }
    100% { opacity: 0; transform: rotateY(0deg) scale(1); }
}
@keyframes gemduel-market-refill-reduced {
    0% { opacity: 0; transform: scale(0.98); }
    45% { opacity: 0.85; transform: scale(1.02); }
    100% { opacity: 0; transform: scale(1); }
}
@keyframes gemduel-card-reserve-deck-flight {
    0% { opacity: 0; transform: translate3d(var(--start-x), var(--start-y), 0) scale(0.92) rotate(-2deg); }
    12% { opacity: 1; }
    34% { opacity: 1; transform: translate3d(var(--start-x), var(--start-y), 0) scale(1.02) rotate(0deg); }
    74% { opacity: 1; transform: translate3d(var(--mid-x), var(--mid-y), 0) scale(1.06) rotate(3deg); }
    100% { opacity: 0; transform: translate3d(var(--end-x), var(--end-y), 0) scale(0.78) rotate(0deg); }
}
@keyframes gemduel-card-reserve-deck-back {
    0% { opacity: 1; transform: rotateY(0deg); }
    30% { opacity: 1; transform: rotateY(0deg); }
    42% { opacity: 0; transform: rotateY(88deg); }
    100% { opacity: 0; transform: rotateY(88deg); }
}
@keyframes gemduel-card-reserve-deck-face {
    0% { opacity: 0; transform: rotateY(-88deg); }
    30% { opacity: 0; transform: rotateY(-88deg); }
    42% { opacity: 1; transform: rotateY(0deg); }
    100% { opacity: 1; transform: rotateY(0deg); }
}
`;
