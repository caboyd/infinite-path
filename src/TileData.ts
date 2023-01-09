import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

export function load_Tile_GLTF(): Tile_GLTF {
    return useGLTF("./assets/tower-defense-kit/tile.glb") as unknown as Tile_GLTF;
}

export function load_Tile_Straight_GLTF(): Tile_Straight_GLTF {
    return useGLTF("./assets/tower-defense-kit/tile_straight.glb") as unknown as Tile_Straight_GLTF;
}

export type Tile_Group = THREE.Group & {
    children: THREE.Mesh[];
};

export type Tile_GLTF_Type = {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
};

export type Tile_Straight_Nodes = {
    Mesh_tile_straight: THREE.Mesh;
    Mesh_tile_straight_1: THREE.Mesh;
    Mesh_tile_straight_2: THREE.Mesh;
    tile_straight: Tile_Group;
};

export type Tile_Straight_GLTF = GLTF & {
    nodes: Tile_Straight_Nodes;
    materials: {
        dirt: THREE.MeshStandardMaterial;
        foliage: THREE.MeshStandardMaterial;
        dirtDark: THREE.MeshStandardMaterial;
    };
};

export type Tile_Nodes = {
    Mesh_tile: THREE.Mesh;
    Mesh_tile_1: THREE.Mesh;
    tile: Tile_Group;
};

export type Tile_GLTF = GLTF &
    Tile_GLTF_Type & {
        nodes: Tile_Nodes;
        materials: {
            dirt: THREE.MeshStandardMaterial;
            foliage: THREE.MeshStandardMaterial;
        };
    };
