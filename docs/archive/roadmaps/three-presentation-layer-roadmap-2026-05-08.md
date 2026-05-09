# Three Presentation Layer Roadmap

## Context

GemDuel's front end is built around a native 16:9 desktop stage. Non-16:9 viewports are expected to show black bars around the stage instead of introducing a separate native layout. Motion and visual presentation work should therefore use the same stage coordinate system as the React game shell.

The current active-turn marker in the TopBar is a CSS-painted diamond rotating with `rotateY`. It reads as a flat 2D sprite because the element has no real geometry, thickness, facet lighting, or scene depth. Future gem-board gems, gem-panel resources, and featured card surfaces need the same direction: real presentation geometry layered over existing gameplay UI without changing gameplay state, card IDs, scoring, or shared protocol behavior.

## Goal

Create a reusable, non-gameplay `ThreePresentationLayer` that can host 3D visual embellishments on top of the existing React UI:

- one transparent WebGL canvas inside the 16:9 stage;
- `pointer-events: none`, so gameplay hit targets remain owned by React;
- orthographic camera coordinates that map directly to the stage canvas;
- DOM anchor lookup for placement, so React remains the source of layout truth;
- graceful no-crash fallback when WebGL is unavailable;
- first vertical slice: replace the active-turn CSS diamond in app shells with a real elongated 3D gold gem.

## Architecture Route

### 1. Layer Boundary

`ThreePresentationLayer` lives in `apps/desktop/src/app/presentation`, not in `packages/shared`, because it is a renderer concern and depends on DOM/WebGL. It can import shared types such as `PlayerKey`, but it must not move gameplay rules into the presentation layer.

The layer is mounted by `GameShell` and `VisualLabRoute` inside the existing desktop stage. It should not portal to `document.body`, because body-space rendering would bypass the 16:9 stage contract and black-bar offsets.

### 2. Coordinate System

The canvas fills the unscaled desktop stage (`3840x2160`). Because `DesktopStage` scales the whole stage with CSS transforms, Three objects should be positioned in stage coordinates and let the stage transform handle viewport scaling.

Placement algorithm:

1. find `[data-testid="desktop-stage-canvas"]`;
2. find the React-owned DOM anchor, such as `[data-topbar-active-player-label]`;
3. read both bounding rects in browser pixels;
4. convert anchor center back into stage pixels using the ratio between stage rect size and canvas client size;
5. place the 3D object in the orthographic scene.

### 3. Rendering Model

The first implementation uses a single `WebGLRenderer`, an orthographic camera, a compact lighting setup, and one elongated diamond mesh. The mesh uses actual vertices, depth, facet normals, metallic material, and continuous Y-axis rotation. This is deliberately small, but it proves the core path that later gem and card meshes can reuse.

Future expansion should keep the same renderer and add scene modules:

- `ActiveTurnGemNode`: persistent current-player indicator anchored to TopBar labels.
- `GemBoardPresentationNode`: instanced 3D gems above board cells and gem panels.
- `CardSurfacePresentationNode`: shallow beveled card planes for preview, market, and featured card moments.
- `PresentationTimelineAdapter`: converts existing presentation events into non-gameplay animation cues.

## Practical Implementation Steps

### Phase 1: Minimal Layer

- Add `three` to the desktop renderer package.
- Add `ThreePresentationLayer.tsx`.
- Mount it in `GameShell` and `VisualLabRoute`.
- Add a `TopBar` prop that can hide the legacy CSS turn pointer while preserving active-player breathing text.
- Render only the active-turn 3D gem in this phase.

Acceptance:

- the app no longer shows the CSS diamond in `GameShell` or `VisualLab`;
- the active player still breathes in the TopBar;
- a transparent Three canvas exists inside the stage;
- the 3D gem is visually below the active P1/P2 label and rotates continuously;
- no gameplay behavior changes.

### Phase 2: Gem Panel And Board Pilot

- Extract mesh creation into a small factory module.
- Add gem color materials matching the existing gem palette.
- Pilot one read-only 3D gem overlay on the gem panel without changing gem buttons or drag/click targets.
- Measure readability at `1440x900`, `1280x720`, and `900x700`.

Acceptance:

- 3D overlays align with existing 2D gem positions;
- React buttons remain clickable;
- no duplicate accessible controls are introduced.

### Phase 3: Card Surface Thickness

- Add shallow beveled card meshes as optional presentation-only surfaces.
- Keep card faces rendered by existing React/card art surfaces until a dedicated texture pipeline is ready.
- Use Three only for edge thickness, lighting, hover/flight depth, and presentation moments.

Acceptance:

- card identity, labels, and preview actions remain React-owned;
- card motion reads as physical without hiding text or action buttons;
- reduced-motion mode keeps the same readable state without continuous movement.

### Phase 4: Visual Lab Controls

- Add Visual Lab toggles for Three layer visibility, rotation speed, lighting preset, and reduced-motion preview.
- Keep those controls inside the existing Visual Lab console.
- Add screenshot/pixel verification for desktop and narrow desktop viewports.

Acceptance:

- Visual Lab can verify active-turn, gem, and card Three nodes independently;
- canvas is nonblank when enabled;
- canvas is not mounted or is visually inert when disabled.

### Phase 5: Performance And Fallback Governance

- Avoid one renderer per component; keep one stage-level renderer.
- Move repeated gems to instanced meshes.
- Pause the render loop when there are no active animated Three nodes.
- Keep explicit `webgl-unavailable` fallback state for browser/test environments.

Acceptance:

- no silent WebGL failure;
- no interaction regressions in React;
- frame cost stays bounded when many gems/cards are visible.

## Validation Plan

- `pnpm --dir packages/ui exec vitest run src/components/__tests__/TopBar.test.tsx`
- `pnpm --dir apps/desktop typecheck`
- `pnpm --dir packages/ui typecheck`
- browser verification at:
    - `http://localhost:5173/`
    - `http://localhost:5173/?visualLab=motion`
    - `1440x900`, `1280x720`, and `900x700`
- browser evidence:
    - Three canvas exists inside `[data-testid="desktop-stage-canvas"]`;
    - CSS pointer is hidden in app shells;
    - active player label still breathes;
    - Three canvas is visually nonblank and the gem is not clipped by the TopBar.

## Non-Goals

- Do not rewrite gameplay rules, scoring, card IDs, or network protocol.
- Do not make a new non-16:9 native layout.
- Do not replace card art with Three textures in the first slice.
- Do not move Three.js into `packages/shared`.
