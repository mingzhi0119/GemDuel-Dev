import type { GemColor } from '@gemduel/shared/types';
import * as THREE from 'three';
import type { BoardGemAnchorSnapshot } from './threeBoardGemAnchors';

export const BOARD_GEM_RADIUS_RATIO = 0.62;

export const BOARD_GEM_COLORS: readonly GemColor[] = [
    'blue',
    'white',
    'green',
    'black',
    'red',
    'pearl',
    'gold',
] as const;

export interface BoardGemObject {
    group: THREE.Group;
    mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
    halo: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>;
}

const BOARD_GEM_TONES: Record<
    GemColor,
    { color: number; emissive: number; halo: number; disabled: number }
> = {
    blue: { color: 0x2d7dff, emissive: 0x2563eb, halo: 0x93c5fd, disabled: 0x25507d },
    white: { color: 0xe6eef7, emissive: 0x9db8d0, halo: 0xf8fafc, disabled: 0x617284 },
    green: { color: 0x12d982, emissive: 0x059669, halo: 0x86efac, disabled: 0x266a4f },
    black: { color: 0x566174, emissive: 0x475569, halo: 0x94a3b8, disabled: 0x293241 },
    red: { color: 0xff315f, emissive: 0xb91c1c, halo: 0xfda4af, disabled: 0x783143 },
    pearl: { color: 0xffcadf, emissive: 0xd98eaa, halo: 0xfbcfe8, disabled: 0x76566a },
    gold: { color: 0xffc83d, emissive: 0xf59e0b, halo: 0xfef08a, disabled: 0x9a721d },
};

export const createBoardGemGeometry = () => {
    const geometry = new THREE.SphereGeometry(1, 18, 10).toNonIndexed();
    const position = geometry.getAttribute('position');
    const colors: number[] = [];
    const facetShades = [1.2, 0.84, 1.04, 0.76, 1.14, 0.92, 1.28, 0.8];

    for (let index = 0; index < position.count; index += 1) {
        const shade = facetShades[Math.floor(index / 3) % facetShades.length]!;
        colors.push(shade, shade, shade);
    }

    geometry.scale(1, 0.94, 0.56);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
};

export const createBoardGemObject = (
    gemGeometry: THREE.BufferGeometry,
    haloGeometry: THREE.TorusGeometry
): BoardGemObject => {
    const tone = BOARD_GEM_TONES.blue;
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
        color: tone.color,
        emissive: tone.emissive,
        emissiveIntensity: 0.44,
        vertexColors: true,
        metalness: 0.12,
        roughness: 0.2,
        transparent: true,
        opacity: 1,
        alphaTest: 0.02,
        flatShading: true,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(gemGeometry, material);
    mesh.renderOrder = 14;

    const haloMaterial = new THREE.MeshBasicMaterial({
        color: tone.halo,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.z = 4;
    halo.renderOrder = 13;
    halo.visible = false;

    group.add(halo, mesh);
    return { group, mesh, halo };
};

export const disposeBoardGemObject = (object: BoardGemObject) => {
    object.mesh.material.dispose();
    object.halo.material.dispose();
};

export const configureBoardGemTexture = (
    material: THREE.MeshStandardMaterial,
    texture: THREE.Texture | null
) => {
    if (material.map !== texture) {
        material.map = texture;
        material.needsUpdate = true;
    }
};

export const resolveBoardGemColors = (anchor: BoardGemAnchorSnapshot, hasTexture: boolean) => {
    const tone = BOARD_GEM_TONES[anchor.color];
    const color = new THREE.Color(hasTexture ? 0xffffff : tone.color);
    const emissive = new THREE.Color(tone.emissive);

    if (anchor.dimmed || !anchor.interactive) {
        color.multiplyScalar(hasTexture ? 0.42 : 0.78);
        emissive.multiplyScalar(0.5);
    }

    if (anchor.selected || anchor.reserveSelected) {
        color.lerp(new THREE.Color(0xffffff), 0.22);
        emissive.lerp(new THREE.Color(0xffd34d), 0.36);
    } else if (anchor.target) {
        color.lerp(new THREE.Color(0xbae6fd), 0.2);
        emissive.lerp(new THREE.Color(0x38bdf8), 0.28);
    }

    return { color, emissive, halo: new THREE.Color(tone.halo) };
};
