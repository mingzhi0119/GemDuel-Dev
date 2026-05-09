import type { Dispatch, SetStateAction } from 'react';
import { clearSurfacePreviewArtworkQuery } from './surfacePreviewQuery';
import {
    createSurfaceThemeSelections,
    type SurfaceThemeSelections,
    type SurfaceThemeVariant,
} from './surfaceTheme';

export const createSurfaceThemeSelector =
    (
        setSurfacePreviewVariant: Dispatch<SetStateAction<SurfaceThemeVariant | undefined>>,
        setSurfaceTheme: (theme: SurfaceThemeSelections) => void
    ) =>
    (variant: SurfaceThemeVariant) => {
        clearSurfacePreviewArtworkQuery();
        setSurfacePreviewVariant(undefined);
        setSurfaceTheme(createSurfaceThemeSelections(variant));
    };
