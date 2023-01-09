import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

const url = "./assets/tower-defense-kit/";

export const tile_data: Tiles_Type = {
    tile: { name: "tile", valid_tile_types: [0] },
    tile_straight: { name: "tile_straight", valid_tile_types: [1, 2], tile_rotation_y: [0, Math.PI / 2] },
    tile_rock: { name: "tile_rock", valid_tile_types: [3] },
    tile_tree: { name: "tile_tree", valid_tile_types: [4] },
} as const;

export type Tile_Type = {
    name: string;
    valid_tile_types: readonly number[];
    tile_rotation_y?: readonly number[];
};

export type Tiles_Type = {
    [key: string]: Tile_Type;
};

export type Tile_Group = THREE.Group & {
    children: (THREE.Mesh)[];
};

export type Tile_GLTF = GLTF & {
    nodes: {
        [key: string]: Tile_Group;
    };
};

export function load_Tile(tt: Tile_Type): Tile_Group {
    return (useGLTF(url + tt.name + ".glb") as unknown as Tile_GLTF).nodes[tt.name];
}
