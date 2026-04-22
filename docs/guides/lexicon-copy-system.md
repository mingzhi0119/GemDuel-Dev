# Lexicon and Player Copy

## Why This Exists

Gem Duel now treats player-facing gameplay terminology as a governed system instead of ad hoc UI text.
Canonical terms, their localized labels, explanatory copy, and legacy aliases all live in one shared lexicon so that:

- the same gameplay noun renders the same way across UI surfaces
- English and Chinese stay aligned
- long-form help text can turn terms into clickable explanations
- old phrasing can still be recognized during migration without remaining in player-facing copy

## Source of Truth

- Canonical term data lives in `packages/shared/src/lexicon/index.ts`.
- Shared helpers such as `getLexiconLabel`, `getLexiconDescription`, and `segmentLexiconText` must be imported from `@gemduel/shared`.
- Do not maintain a second handwritten glossary in `packages/shared/src/i18n/catalogs/**`.
- If a gameplay term already exists in the lexicon, update the lexicon entry first and then consume it from UI or i18n surfaces.

## When To Use Which API

### Explicit short labels

Use these for headings, badges, buttons, compact labels, and stable UI chrome.

- `getLexiconLabel(termId, locale)` inside shared catalogs or other non-React code
- `<LexiconTerm termId="..." />` inside React UI when the term itself should be clickable

### Long-form prose

Use `<LexiconText text="..." />` only on designated long-form surfaces:

- rulebook prose
- buff descriptions
- card anatomy explanations
- other stable instructional text blocks

Do not run `LexiconText` across the whole app or on transient runtime feedback.

## Matching Rules

`LexiconText` is intentionally deterministic and table-driven.

### English

- Matching is left-to-right.
- Longest alias wins first.
- Matching is whole-term by default.
- Whole-term boundaries reject matches inside larger ASCII word forms such as `bonus_gem`.
- No stemming or fuzzy root matching is allowed.

### Chinese

- Matching is exact contiguous substring only.
- No fuzzy segmentation is used.
- If punctuation or numbered wording matters, add an explicit alias in the lexicon instead of adding heuristics.

## Authoring Rules

- Keep canonical gameplay nouns in the lexicon, not duplicated inline across multiple catalogs.
- Legacy names such as `Royal Court` or `Select Joker Color` may exist only as lexicon aliases or in regression tests. They must not remain in player-facing copy.
- Prefer semantic canonical terms:
    - `Royal`
    - `Royal Card`
    - `Gem Cap`
    - `Single-Color Points`
    - `Wild Bonus`
    - `Extra Turn`
    - `Bonus Gem`
    - `Steal`
    - `Privilege`
- Keep `Buff` as the display term unless product direction changes.

## UI Interaction Rules

- Click, not hover, opens lexicon explanations.
- Clickable terms must stay visibly underlined so players know they are interactive.
- Only one lexicon popover may be open at a time.
- `Escape`, outside click, or clicking the same term again closes the popover.
- Popovers must restore focus to the triggering button when they close through keyboard interaction.

## Testing Requirements

When you touch canonical terms, aliases, or lexicon rendering, update the matching tests and the affected regression tests.

- Shared lexicon tests: `packages/shared/src/lexicon/__tests__/lexicon.test.ts`
- UI interaction tests: `packages/ui/src/lexicon/__tests__/LexiconTerm.test.tsx`
- Copy regression checks: `packages/ui/src/components/__tests__/LexiconRegression.test.tsx`
- Surface integration checks:
    - `packages/ui/src/components/__tests__/Rulebook.test.tsx`
    - `packages/ui/src/components/__tests__/CardAnatomyPage.test.tsx`
    - `apps/desktop/src/app/overlays/__tests__/AppOverlayStack.test.tsx`

## Local Artifact Rule

Generated replay batches under `Replay/` are local artifacts and are intentionally gitignored. Use them for replay generation and audit work, but do not commit them unless a task explicitly changes that policy.
