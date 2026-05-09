export const MAX_DEVICE_PIXEL_RATIO = 2;

export const canUseWebGL = () => {
    if (typeof document === 'undefined') {
        return false;
    }

    try {
        const probe = document.createElement('canvas');
        return Boolean(
            probe.getContext('webgl2', { alpha: true }) ||
            probe.getContext('webgl', { alpha: true })
        );
    } catch {
        return false;
    }
};
