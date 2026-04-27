# Light/Dark Runtime Theme Retirement Plan (2026-04-27)

## Status

Implemented as a full cleanup. The application keeps one runtime display theme: `dark`.

## Goal

- Retire the user-selectable Light/Dark runtime theme.
- Keep compatibility with old `gemduel.preferences.v1` values that include `theme: "light"` or `theme: "dark"`.
- Preserve the Surface Style selector for anime/surface artwork variants.
- Rename visible surface copy away from generic "Theme" wording.

## Implementation Decisions

- `ThemeName` is a single-value runtime type: `dark`.
- `useSettings` normalizes all legacy stored theme values to `dark`.
- New settings writes do not persist a user theme preference.
- App routing, Chrome, shell styling, and surface artwork use dark-only runtime paths.
- Surface Style variants remain user-selectable and continue to persist through `surfaceTheme`.
- Historical art-library docs may continue to mention light candidates as archive evidence; live runtime docs and code should not point to light runtime paths.

## Runtime Cleanup

- Removed the settings Light/Dark toggle.
- Removed theme toggle callbacks from route contracts.
- Removed surface preview theme query mutation.
- Collapsed shell, top bar, gem panel, market card back, and player-zone runtime asset resolution to:
  `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/...`
- Removed light-mode route fallbacks and light-specific shell palettes.

## Asset Policy

Runtime surface assets are dark-only:

- `anime-themes/<style>/dark/shell-background.png`
- `anime-themes/<style>/dark/topbar.png`
- `anime-themes/<style>/dark/player-zone.png`
- `anime-themes/<style>/dark/player-zone-p1.png`
- `anime-themes/<style>/dark/player-zone-p2.png`
- `anime-themes/<style>/dark/gem-panel.png`
- `anime-themes/<style>/dark/market-card-back-l1.png`
- `anime-themes/<style>/dark/market-card-back-l2.png`
- `anime-themes/<style>/dark/market-card-back-l3.png`
- `anime-themes/<style>/dark/royal-card-back.png`

Retired light runtime resource directories should stay deleted unless a future task explicitly reintroduces a multi-theme runtime.

## Validation

Required local gates after implementation:

- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`

Because this changes visual shell resources, use a browser/dev-server visual pass for final visual acceptance when available.
