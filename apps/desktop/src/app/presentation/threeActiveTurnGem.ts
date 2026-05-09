import * as THREE from 'three';

const ACTIVE_GEM_WIDTH_PX = 30;
export const ACTIVE_GEM_HEIGHT_PX = 90;
const ACTIVE_GEM_DEPTH_PX = 30;
export const ACTIVE_GEM_TOP_OFFSET_PX = 22;

export const createActiveTurnGemGeometry = () => {
    const vertices: number[] = [];
    const colors: number[] = [];
    const width = ACTIVE_GEM_WIDTH_PX;
    const height = ACTIVE_GEM_HEIGHT_PX;
    const depth = ACTIVE_GEM_DEPTH_PX;
    const points = {
        top: [0, -height / 2, 0] as const,
        bottom: [0, height / 2, 0] as const,
        left: [-width / 2, 0, 0] as const,
        right: [width / 2, 0, 0] as const,
        front: [0, 0, depth / 2] as const,
        back: [0, 0, -depth / 2] as const,
    };
    const facetColors = [
        new THREE.Color(0xfff7bd),
        new THREE.Color(0xffdc3d),
        new THREE.Color(0xe49b18),
        new THREE.Color(0xffea83),
        new THREE.Color(0xc96d0c),
        new THREE.Color(0xffc53d),
        new THREE.Color(0xb55d08),
        new THREE.Color(0xffffd4),
    ];

    const pushVertex = (point: readonly [number, number, number], color: THREE.Color) => {
        vertices.push(point[0], point[1], point[2]);
        colors.push(color.r, color.g, color.b);
    };
    const pushFacet = (
        a: readonly [number, number, number],
        b: readonly [number, number, number],
        c: readonly [number, number, number],
        color: THREE.Color
    ) => {
        pushVertex(a, color);
        pushVertex(b, color);
        pushVertex(c, color);
    };

    pushFacet(points.top, points.right, points.front, facetColors[0]);
    pushFacet(points.right, points.bottom, points.front, facetColors[1]);
    pushFacet(points.bottom, points.left, points.front, facetColors[2]);
    pushFacet(points.left, points.top, points.front, facetColors[3]);
    pushFacet(points.right, points.top, points.back, facetColors[4]);
    pushFacet(points.bottom, points.right, points.back, facetColors[5]);
    pushFacet(points.left, points.bottom, points.back, facetColors[6]);
    pushFacet(points.top, points.left, points.back, facetColors[7]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
};
