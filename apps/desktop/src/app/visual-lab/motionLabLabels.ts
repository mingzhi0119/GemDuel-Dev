import type { SurfaceLabMotionEventType } from './motionLabEvents';

export const getMotionLabel = (type: SurfaceLabMotionEventType): string =>
    type
        .split('-')
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' ');
