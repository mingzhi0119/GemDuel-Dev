import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import * as THREE from 'three';
import { collectCardSlabAnchors } from './threeCardSlabAnchors';
import {
    applyTone,
    createCardSlabObject,
    disposeCardSlabObject,
    getCanvasCoordinateSpace,
    needsGeometryRefresh,
    resolveCardSlabPlacement,
    type CardSlabObject,
} from './threeCardSlabObjects';
import { canUseWebGL, MAX_DEVICE_PIXEL_RATIO } from './threeWebglSupport';

type ThreeCardSlabLayerStatus = 'pending' | 'running' | 'webgl-unavailable';

export function ThreeCardSlabLayer({ enabled = true }: { enabled?: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [status, setStatus] = useState<ThreeCardSlabLayerStatus>('pending');

    useEffect(() => {
        if (!enabled) {
            setStatus('pending');
            return undefined;
        }

        const canvas = canvasRef.current;
        if (!canvas || !canUseWebGL()) {
            setStatus('webgl-unavailable');
            return undefined;
        }

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: true,
                powerPreference: 'high-performance',
            });
        } catch {
            setStatus('webgl-unavailable');
            return undefined;
        }

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1000, 1000);
        camera.position.z = 600;

        const ambientLight = new THREE.AmbientLight(0xf8fbff, 2.2);
        const keyLight = new THREE.DirectionalLight(0xffffff, 5.2);
        keyLight.position.set(-360, -520, 520);
        const rimLight = new THREE.PointLight(0xffd27a, 3.8, 900);
        rimLight.position.set(280, 120, 360);
        scene.add(ambientLight, keyLight, rimLight);

        let disposed = false;
        let frameId = 0;
        let width = 0;
        let height = 0;
        const objects = new Map<string, CardSlabObject>();

        const updateSize = () => {
            const space = getCanvasCoordinateSpace(canvas);
            width = space.width;
            height = space.height;
            const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);

            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(width, height, false);
            camera.left = 0;
            camera.right = width;
            camera.top = 0;
            camera.bottom = height;
            camera.updateProjectionMatrix();
        };

        const updateSlabs = (time: number) => {
            const space = getCanvasCoordinateSpace(canvas);
            if (Math.abs(width - space.width) > 0.5 || Math.abs(height - space.height) > 0.5) {
                updateSize();
            }

            const anchors = collectCardSlabAnchors(document);
            const activeKeys = new Set<string>();

            for (const anchor of anchors) {
                activeKeys.add(anchor.key);
                const placement = resolveCardSlabPlacement(anchor, space);

                let object = objects.get(anchor.key);
                if (object && needsGeometryRefresh(object, placement)) {
                    scene.remove(object.group);
                    disposeCardSlabObject(object);
                    objects.delete(anchor.key);
                    object = undefined;
                }

                if (!object) {
                    object = createCardSlabObject(placement.width, placement.height);
                    objects.set(anchor.key, object);
                    scene.add(object.group);
                }

                object.group.visible = true;
                object.group.position.set(
                    placement.centerX,
                    placement.centerY,
                    anchor.layer === 'flight' ? 32 : 20
                );
                applyTone(object, anchor, time, prefersReducedMotion);
            }

            for (const [key, object] of objects) {
                if (!activeKeys.has(key)) {
                    scene.remove(object.group);
                    disposeCardSlabObject(object);
                    objects.delete(key);
                }
            }
        };

        const animate = (time: number) => {
            if (disposed) {
                return;
            }

            updateSlabs(time);
            renderer.render(scene, camera);
            frameId = window.requestAnimationFrame(animate);
        };

        updateSize();
        setStatus('running');
        frameId = window.requestAnimationFrame(animate);
        window.addEventListener('resize', updateSize);

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', updateSize);
            for (const object of objects.values()) {
                disposeCardSlabObject(object);
            }
            objects.clear();
            renderer.dispose();
        };
    }, [enabled, prefersReducedMotion]);

    if (!enabled) {
        return null;
    }

    const canvas = (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            data-three-card-slab-layer="true"
            data-three-card-slab-layer-status={status}
            data-three-card-slab-coordinate-space="canvas-local"
            className="pointer-events-none fixed inset-0 z-[158] block h-screen w-screen"
        />
    );

    return typeof document === 'undefined' ? canvas : createPortal(canvas, document.body);
}
