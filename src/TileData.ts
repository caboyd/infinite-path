import { GLTF } from "three-stdlib";

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
