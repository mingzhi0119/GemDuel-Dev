import { useEffect, useRef, useState } from 'react';
import type { GemColor, PlayerKey } from '@gemduel/shared/types';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import { getGemArtworkAssetPath } from '@gemduel/ui/components/gemArtworkAssets';
import * as THREE from 'three';
import {
    ACTIVE_GEM_HEIGHT_PX,
    ACTIVE_GEM_TOP_OFFSET_PX,
    createActiveTurnGemGeometry,
} from './threeActiveTurnGem';
import { ThreeBoardSelectionOverlay, type SelectionMarker } from './ThreeBoardSelectionOverlay';
import { collectBoardGemAnchors } from './threeBoardGemAnchors';
import {
    BOARD_GEM_COLORS,
    BOARD_GEM_RADIUS_RATIO,
    configureBoardGemTexture,
    createBoardGemGeometry,
    createBoardGemObject,
    disposeBoardGemObject,
    resolveBoardGemColors,
    type BoardGemObject,
} from './threeBoardGemObjects';
import { canUseWebGL, MAX_DEVICE_PIXEL_RATIO } from './threeWebglSupport';

export type ThreeLayerStatus = 'pending' | 'running' | 'webgl-unavailable';

interface ThreePresentationLayerProps {
    activePlayer: PlayerKey;
    enabled?: boolean;
    renderActiveTurnPointer?: boolean;
    renderGemBoard?: boolean;
    onStatusChange?: (status: ThreeLayerStatus) => void;
}

export function ThreePresentationLayer({
    activePlayer,
    enabled = true,
    renderActiveTurnPointer = true,
    renderGemBoard = false,
    onStatusChange,
}: ThreePresentationLayerProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const markerSignatureRef = useRef('');
    const prefersReducedMotion = usePrefersReducedMotion();
    const [status, setStatus] = useState<ThreeLayerStatus>('pending');
    const [selectionMarkers, setSelectionMarkers] = useState<SelectionMarker[]>([]);

    useEffect(() => {
        onStatusChange?.(status);
    }, [onStatusChange, status]);

    useEffect(() => {
        if (!enabled) {
            setStatus('pending');
            setSelectionMarkers([]);
            markerSignatureRef.current = '';
            return undefined;
        }

        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;

        if (!canvas || !parent || !canUseWebGL()) {
            setStatus('webgl-unavailable');
            setSelectionMarkers([]);
            markerSignatureRef.current = '';
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
            setSelectionMarkers([]);
            markerSignatureRef.current = '';
            return undefined;
        }

        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1000, 1000);
        camera.position.z = 700;

        const activeTurnGroup = new THREE.Group();
        activeTurnGroup.visible = false;
        scene.add(activeTurnGroup);

        const activeGeometry = createActiveTurnGemGeometry();
        const activeMaterial = new THREE.MeshStandardMaterial({
            vertexColors: true,
            metalness: 0.62,
            roughness: 0.16,
            emissive: new THREE.Color(0xffb000),
            emissiveIntensity: 0.52,
            side: THREE.DoubleSide,
        });
        const activeGem = new THREE.Mesh(activeGeometry, activeMaterial);
        activeTurnGroup.add(activeGem);

        const boardGroup = new THREE.Group();
        boardGroup.visible = false;
        scene.add(boardGroup);

        const boardGemGeometry = createBoardGemGeometry();
        const boardHaloGeometry = new THREE.TorusGeometry(1.08, 0.052, 10, 64);
        const boardObjects = new Map<string, BoardGemObject>();

        const ambientLight = new THREE.AmbientLight(0xf0f7ff, 2.45);
        const keyLight = new THREE.DirectionalLight(0xffffff, 5.8);
        keyLight.position.set(-260, -360, 520);
        const fillLight = new THREE.DirectionalLight(0x86c7ff, 2.8);
        fillLight.position.set(260, 160, 340);
        const rimLight = new THREE.PointLight(0xffe08a, 4.8, 760);
        rimLight.position.set(90, -80, 310);
        scene.add(ambientLight, keyLight, fillLight, rimLight);

        let frameId = 0;
        let width = 0;
        let height = 0;
        let disposed = false;
        const boardGemTextures = new Map<GemColor, THREE.Texture>();
        const textureLoader = new THREE.TextureLoader();
        const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

        BOARD_GEM_COLORS.forEach((color) => {
            textureLoader.load(
                getGemArtworkAssetPath(color),
                (texture) => {
                    if (disposed) {
                        texture.dispose();
                        return;
                    }

                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.repeat.set(0.64, 0.64);
                    texture.offset.set(0.18, 0.18);
                    texture.magFilter = THREE.LinearFilter;
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.anisotropy = maxAnisotropy;
                    texture.needsUpdate = true;
                    boardGemTextures.set(color, texture);
                },
                undefined,
                () => {
                    boardGemTextures.delete(color);
                }
            );
        });

        const updateSelectionMarkers = (markers: SelectionMarker[]) => {
            const signature = markers
                .map(
                    (marker) =>
                        `${marker.key}:${marker.label}:${marker.x.toFixed(1)},${marker.y.toFixed(1)}`
                )
                .join('|');

            if (signature !== markerSignatureRef.current) {
                markerSignatureRef.current = signature;
                setSelectionMarkers(markers);
            }
        };

        const updateSize = () => {
            width = Math.max(1, parent.clientWidth);
            height = Math.max(1, parent.clientHeight);
            const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);

            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(width, height, false);
            renderer.setClearColor(0x000000, 0);

            camera.left = 0;
            camera.right = width;
            camera.top = 0;
            camera.bottom = height;
            camera.updateProjectionMatrix();
        };

        const updateActiveTurnGem = (time: number) => {
            if (!renderActiveTurnPointer) {
                activeTurnGroup.visible = false;
                return;
            }

            const activeLabel = parent.querySelector<HTMLElement>(
                `[data-topbar-player-label="${activePlayer}"]`
            );

            if (!activeLabel || !width || !height) {
                activeTurnGroup.visible = false;
                return;
            }

            const stageRect = canvas.getBoundingClientRect();
            const labelRect = activeLabel.getBoundingClientRect();

            if (!stageRect.width || !stageRect.height || !labelRect.width || !labelRect.height) {
                activeTurnGroup.visible = false;
                return;
            }

            const labelCenterX = labelRect.left + labelRect.width / 2;
            const x = ((labelCenterX - stageRect.left) / stageRect.width) * width;
            const y =
                ((labelRect.bottom - stageRect.top) / stageRect.height) * height +
                ACTIVE_GEM_TOP_OFFSET_PX +
                ACTIVE_GEM_HEIGHT_PX / 2;

            activeTurnGroup.position.set(x, y, 0);
            activeTurnGroup.visible = true;
            activeGem.rotation.y = prefersReducedMotion
                ? Math.PI * 0.16
                : (time * 0.00185) % (Math.PI * 2);
            activeGem.rotation.x = Math.PI * 0.03;
        };

        const updateBoardGems = (time: number) => {
            if (!renderGemBoard || !width || !height) {
                boardGroup.visible = false;
                updateSelectionMarkers([]);
                return;
            }

            const stageRect = canvas.getBoundingClientRect();
            if (!stageRect.width || !stageRect.height) {
                boardGroup.visible = false;
                updateSelectionMarkers([]);
                return;
            }

            const anchors = collectBoardGemAnchors(parent);
            const activeKeys = new Set<string>();
            const markers: SelectionMarker[] = [];

            boardGroup.visible = anchors.length > 0;

            for (const anchor of anchors) {
                let object = boardObjects.get(anchor.key);
                if (!object) {
                    object = createBoardGemObject(boardGemGeometry, boardHaloGeometry);
                    boardObjects.set(anchor.key, object);
                    boardGroup.add(object.group);
                }

                activeKeys.add(anchor.key);

                const centerX =
                    ((anchor.rect.left + anchor.rect.width / 2 - stageRect.left) /
                        stageRect.width) *
                    width;
                const centerY =
                    ((anchor.rect.top + anchor.rect.height / 2 - stageRect.top) /
                        stageRect.height) *
                    height;
                const baseRadius =
                    Math.min(anchor.rect.width, anchor.rect.height) * BOARD_GEM_RADIUS_RATIO;
                const stateScale =
                    anchor.selected || anchor.reserveSelected ? 1.1 : anchor.target ? 1.05 : 1;
                const floatOffset =
                    prefersReducedMotion || anchor.dimmed
                        ? 0
                        : Math.sin(time * 0.0022 + anchor.row * 0.9 + anchor.col * 0.7) * 1.4;

                object.group.visible = true;
                object.group.position.set(
                    centerX,
                    centerY + floatOffset,
                    anchor.selected || anchor.reserveSelected ? 12 : 6
                );
                object.group.scale.setScalar(baseRadius * stateScale);

                object.mesh.rotation.x = -0.52;
                object.mesh.rotation.y = prefersReducedMotion
                    ? 0.36
                    : 0.36 + Math.sin(time * 0.0011 + anchor.row * 0.6 + anchor.col * 0.5) * 0.16;
                object.mesh.rotation.z = 0.16;

                const texture = boardGemTextures.get(anchor.color) ?? null;
                configureBoardGemTexture(object.mesh.material, texture);

                const colors = resolveBoardGemColors(anchor, Boolean(texture));
                object.mesh.material.color.copy(colors.color);
                object.mesh.material.emissive.copy(colors.emissive);
                object.mesh.material.emissiveIntensity =
                    anchor.selected || anchor.reserveSelected ? 0.86 : anchor.target ? 0.72 : 0.48;
                object.mesh.material.opacity = anchor.dimmed || !anchor.interactive ? 0.78 : 1;

                const showHalo = anchor.selected || anchor.target || anchor.reserveSelected;
                object.halo.visible = showHalo;
                object.halo.material.color.copy(colors.halo);
                object.halo.material.opacity = showHalo
                    ? anchor.selected || anchor.reserveSelected
                        ? 0.9
                        : 0.64
                    : 0;
                object.halo.scale.setScalar(anchor.target ? 1.16 : 1.08);

                if (anchor.selected && anchor.selectionIndex >= 0) {
                    markers.push({
                        key: anchor.key,
                        label: String(anchor.selectionIndex + 1),
                        x:
                            ((anchor.rect.left + anchor.rect.width / 2 - stageRect.left) /
                                stageRect.width) *
                            parent.clientWidth,
                        y:
                            ((anchor.rect.top + anchor.rect.height / 2 - stageRect.top) /
                                stageRect.height) *
                            parent.clientHeight,
                    });
                }
            }

            for (const [key, object] of boardObjects) {
                if (!activeKeys.has(key)) {
                    boardGroup.remove(object.group);
                    disposeBoardGemObject(object);
                    boardObjects.delete(key);
                }
            }

            updateSelectionMarkers(markers);
        };

        const animate = (time: number) => {
            if (disposed) {
                return;
            }

            updateActiveTurnGem(time);
            updateBoardGems(time);
            renderer.render(scene, camera);
            frameId = window.requestAnimationFrame(animate);
        };

        updateSize();
        setStatus('running');
        frameId = window.requestAnimationFrame(animate);

        const resizeObserver =
            typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateSize) : null;
        resizeObserver?.observe(parent);
        window.addEventListener('resize', updateSize);

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', updateSize);
            resizeObserver?.disconnect();
            for (const object of boardObjects.values()) {
                disposeBoardGemObject(object);
            }
            boardObjects.clear();
            activeGeometry.dispose();
            activeMaterial.dispose();
            boardGemGeometry.dispose();
            boardHaloGeometry.dispose();
            for (const texture of boardGemTextures.values()) {
                texture.dispose();
            }
            boardGemTextures.clear();
            renderer.dispose();
        };
    }, [activePlayer, enabled, prefersReducedMotion, renderActiveTurnPointer, renderGemBoard]);

    if (!enabled) {
        return null;
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                data-three-presentation-layer="active-turn"
                data-three-presentation-layer-status={status}
                data-three-active-turn-layer={renderActiveTurnPointer ? 'enabled' : 'disabled'}
                data-three-active-turn-player={activePlayer}
                data-three-gem-board-layer={renderGemBoard ? 'enabled' : 'disabled'}
                data-three-board-gem-texture-source="existing-gem-assets"
                className="pointer-events-none absolute inset-0 z-[74]"
            />
            <ThreeBoardSelectionOverlay markers={selectionMarkers} />
        </>
    );
}
