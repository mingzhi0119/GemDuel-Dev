import * as THREE from 'three';
import type { CardSlabAnchorSnapshot } from './threeCardSlabAnchors';

export interface CardSlabObject {
    group: THREE.Group;
    frame: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshStandardMaterial[]>;
    shadow: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshBasicMaterial>;
    geometry: THREE.ExtrudeGeometry;
    frontMaterial: THREE.MeshStandardMaterial;
    sideMaterial: THREE.MeshStandardMaterial;
    shadowMaterial: THREE.MeshBasicMaterial;
    width: number;
    height: number;
}

interface CanvasCoordinateSpace {
    rect: DOMRect;
    width: number;
    height: number;
}

interface CardSlabPlacement {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
}

interface SlabTone {
    front: number;
    side: number;
    emissive: number;
    shadow: number;
    opacity: number;
    emissiveIntensity: number;
}

const CARD_FRAME_THICKNESS_RATIO = 0.038;
const CARD_CORNER_RADIUS_RATIO = 0.058;

const drawRoundedRect = (
    path: THREE.Shape | THREE.Path,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
) => {
    const right = x + width;
    const bottom = y + height;

    path.moveTo(x + radius, y);
    path.lineTo(right - radius, y);
    path.quadraticCurveTo(right, y, right, y + radius);
    path.lineTo(right, bottom - radius);
    path.quadraticCurveTo(right, bottom, right - radius, bottom);
    path.lineTo(x + radius, bottom);
    path.quadraticCurveTo(x, bottom, x, bottom - radius);
    path.lineTo(x, y + radius);
    path.quadraticCurveTo(x, y, x + radius, y);
};

const createCardSlabGeometry = (width: number, height: number): THREE.ExtrudeGeometry => {
    const minSide = Math.min(width, height);
    const thickness = Math.max(3.5, minSide * CARD_FRAME_THICKNESS_RATIO);
    const radius = Math.max(6, minSide * CARD_CORNER_RADIUS_RATIO);
    const depth = Math.max(5, minSide * 0.045);
    const bevelSize = Math.max(0.9, minSide * 0.009);
    const shape = new THREE.Shape();
    const inner = new THREE.Path();

    drawRoundedRect(shape, -width / 2, -height / 2, width, height, radius);
    drawRoundedRect(
        inner,
        -width / 2 + thickness,
        -height / 2 + thickness,
        width - thickness * 2,
        height - thickness * 2,
        Math.max(2, radius - thickness)
    );
    shape.holes.push(inner);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize,
        bevelThickness: bevelSize * 0.9,
        curveSegments: 10,
        steps: 1,
    });
    geometry.translate(0, 0, -depth / 2);
    geometry.computeBoundingSphere();
    return geometry;
};

const resolveSlabTone = (anchor: CardSlabAnchorSnapshot): SlabTone => {
    if (anchor.royal) {
        return {
            front: 0xffd45a,
            side: 0x7b4b12,
            emissive: 0xffb020,
            shadow: 0x271306,
            opacity: anchor.layer === 'preview' ? 0.9 : 0.72,
            emissiveIntensity: 0.2,
        };
    }

    if (anchor.affordable) {
        return {
            front: 0x9ef7d0,
            side: 0x146b52,
            emissive: 0x34d399,
            shadow: 0x061f1a,
            opacity: 0.66,
            emissiveIntensity: 0.12,
        };
    }

    if (anchor.layer === 'flight') {
        return {
            front: 0xd7e7ff,
            side: 0x345074,
            emissive: 0x7dd3fc,
            shadow: 0x07111f,
            opacity: 0.78,
            emissiveIntensity: 0.16,
        };
    }

    if (anchor.layer === 'preview') {
        return {
            front: 0xffe6a3,
            side: 0x62401a,
            emissive: 0xfacc15,
            shadow: 0x180f06,
            opacity: 0.82,
            emissiveIntensity: 0.18,
        };
    }

    return {
        front: anchor.theme === 'light' ? 0xc9b27b : 0xb99b5f,
        side: anchor.theme === 'light' ? 0x5f4824 : 0x30220f,
        emissive: 0xb8892a,
        shadow: 0x06080f,
        opacity: 0.56,
        emissiveIntensity: 0.08,
    };
};

export const createCardSlabObject = (width: number, height: number): CardSlabObject => {
    const geometry = createCardSlabGeometry(width, height);
    const frontMaterial = new THREE.MeshStandardMaterial({
        color: 0xb99b5f,
        emissive: 0xb8892a,
        emissiveIntensity: 0.08,
        metalness: 0.86,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
    });
    const sideMaterial = new THREE.MeshStandardMaterial({
        color: 0x30220f,
        emissive: 0x070707,
        emissiveIntensity: 0.08,
        metalness: 0.72,
        roughness: 0.38,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
    });
    const shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x06080f,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const group = new THREE.Group();
    const shadow = new THREE.Mesh(geometry, shadowMaterial);
    const frame = new THREE.Mesh(geometry, [frontMaterial, sideMaterial]);

    shadow.renderOrder = 18;
    frame.renderOrder = 19;
    shadow.position.set(2, 2, -8);
    shadow.scale.set(1.008, 1.006, 1);

    group.add(shadow, frame);
    return {
        group,
        frame,
        shadow,
        geometry,
        frontMaterial,
        sideMaterial,
        shadowMaterial,
        width,
        height,
    };
};

export const disposeCardSlabObject = (object: CardSlabObject) => {
    object.geometry.dispose();
    object.frontMaterial.dispose();
    object.sideMaterial.dispose();
    object.shadowMaterial.dispose();
};

export const getCanvasCoordinateSpace = (canvas: HTMLCanvasElement): CanvasCoordinateSpace => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width || window.innerWidth);
    const height = Math.max(1, rect.height || window.innerHeight);
    return { rect, width, height };
};

export const resolveCardSlabPlacement = (
    anchor: CardSlabAnchorSnapshot,
    space: CanvasCoordinateSpace
): CardSlabPlacement => {
    const scaleX = space.width / Math.max(1, space.rect.width);
    const scaleY = space.height / Math.max(1, space.rect.height);
    const centerX = (anchor.rect.left - space.rect.left + anchor.rect.width / 2) * scaleX;
    const centerY = (anchor.rect.top - space.rect.top + anchor.rect.height / 2) * scaleY;

    return {
        centerX,
        centerY,
        width: anchor.rect.width * scaleX,
        height: anchor.rect.height * scaleY,
    };
};

export const needsGeometryRefresh = (
    object: CardSlabObject,
    placement: CardSlabPlacement
): boolean =>
    Math.abs(object.width - placement.width) > 1 || Math.abs(object.height - placement.height) > 1;

export const applyTone = (
    object: CardSlabObject,
    anchor: CardSlabAnchorSnapshot,
    time: number,
    prefersReducedMotion: boolean
) => {
    const tone = resolveSlabTone(anchor);
    const shimmer =
        prefersReducedMotion || anchor.layer === 'market'
            ? 0
            : Math.sin(time * 0.0024 + anchor.rect.left * 0.01) * 0.035;

    object.frontMaterial.color.setHex(tone.front);
    object.frontMaterial.emissive.setHex(tone.emissive);
    object.frontMaterial.opacity = tone.opacity;
    object.frontMaterial.emissiveIntensity = tone.emissiveIntensity + shimmer;
    object.sideMaterial.color.setHex(tone.side);
    object.sideMaterial.emissive.setHex(tone.shadow);
    object.sideMaterial.opacity = Math.min(0.9, tone.opacity + 0.1);
    object.shadowMaterial.color.setHex(tone.shadow);
    object.shadowMaterial.opacity =
        anchor.layer === 'flight' ? 0.32 : anchor.layer === 'preview' ? 0.28 : 0.2;
};
