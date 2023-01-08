import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

export function load_Tile_GLTF(): Tile_GLTF {
    return useGLTF("./assets/tower-defense-kit/tile.glb") as unknown as Tile_GLTF;
}

export function load_Tile_Straight_GLTF(): Tile_Straight_GLTF {
    return useGLTF("./assets/tower-defense-kit/tile_straight.glb") as unknown as Tile_Straight_GLTF;
}

export type Tile_Straight_GLTF = GLTF & {
    nodes: {
        Mesh_tile_straight: THREE.Mesh;
        Mesh_tile_straight_1: THREE.Mesh;
        Mesh_tile_straight_2: THREE.Mesh;
    };
    materials: {
        dirt: THREE.MeshStandardMaterial;
        foliage: THREE.MeshStandardMaterial;
        dirtDark: THREE.MeshStandardMaterial;
    };
};

export type Tile_GLTF = GLTF & {
    nodes: {
        Mesh_tile: THREE.Mesh;
        Mesh_tile_1: THREE.Mesh;
    };
    materials: {
        dirt: THREE.MeshStandardMaterial;
        foliage: THREE.MeshStandardMaterial;
    };
};
