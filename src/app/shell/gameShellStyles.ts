import type { CSSProperties } from 'react';
import type { ResponsiveLayout, ThemeName } from '../../types';

export interface GameShellStyles {
    lightShellStyle: CSSProperties;
    scaledZoneWrapperStyle: CSSProperties;
    playMatSurfaceStyle: CSSProperties;
    playMatDividerStyle: CSSProperties;
    playerRailStyle: CSSProperties;
}

export const createGameShellStyles = (
    theme: ThemeName,
    layout: ResponsiveLayout
): GameShellStyles => ({
    lightShellStyle: {
        '--surface-base': '#F4F7F6',
        '--surface-base-edge': '#EEF2F1',
        '--surface-subtle': 'rgba(255,255,255,0.44)',
        '--surface-divider': 'rgba(15,23,42,0.06)',
        '--surface-shadow': '0 12px 30px rgba(15,23,42,0.06)',
        '--surface-inset':
            'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -8px 16px rgba(15,23,42,0.03)',
        backgroundColor: 'var(--surface-base)',
        backgroundImage:
            'radial-gradient(circle at 50% 42%, #FBFCFC 0%, #F4F7F6 58%, #EEF2F1 100%)',
    } as CSSProperties,
    scaledZoneWrapperStyle: {
        width: `${100 / layout.zoneScale}%`,
        height: `${100 / layout.zoneScale}%`,
        transform: `scale(${layout.zoneScale})`,
        transformOrigin: 'center center',
    } as CSSProperties,
    playMatSurfaceStyle:
        theme === 'light'
            ? ({
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--surface-divider)',
                  boxShadow: 'var(--surface-shadow), var(--surface-inset)',
              } as CSSProperties)
            : ({
                  background: 'rgba(15,23,42,0.18)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03)',
              } as CSSProperties),
    playMatDividerStyle:
        theme === 'light'
            ? ({ backgroundColor: 'rgba(15,23,42,0.06)' } as CSSProperties)
            : ({ backgroundColor: 'rgba(148,163,184,0.12)' } as CSSProperties),
    playerRailStyle: {
        height: `${layout.zoneHeightPx}px`,
        ...(theme === 'light'
            ? {
                  background:
                      'linear-gradient(180deg, rgba(251,252,252,0.78) 0%, rgba(244,247,246,0.92) 100%)',
                  borderTop: '1px solid rgba(15,23,42,0.08)',
                  boxShadow: '0 -10px 20px rgba(15,23,42,0.04)',
              }
            : {
                  borderTop: '1px solid rgba(255,255,255,0.06)',
              }),
    } as CSSProperties,
});
