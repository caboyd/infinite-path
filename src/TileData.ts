import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

const url = "./assets/tower-defense-kit/";

export type Tile_Instances = {
    [key: string]: THREE.InstancedMesh;
};

export const tile_data: Tiles_Type = {
    tile: { name: "tile", valid_tile_types: [0] },
    tile_straight: { name: "tile_straight", valid_tile_types: [1, 2], tile_rotation_y: [0, Math.PI / 2] },
    tile_rock: { name: "tile_rock", valid_tile_types: [3] },
    tile_tree: { name: "tile_tree", valid_tile_types: [4] },
    tile_treeDouble: { name: "tile_treeDouble", valid_tile_types: [5] },
    tile_treeQuad: { name: "tile_treeQuad", valid_tile_types: [6] },
    tile_slope: { name: "tile_slope", valid_tile_types: [7] },
} as const;

const valid_tile_types_data = (() => {
    const result: Record<number, Tile_Type> = {};
    for (const tile of Object.values(tile_data)) {
        for (const valid_tile_type of tile.valid_tile_types) {
            result[valid_tile_type] = tile;
        }
    }
    return result;
})();

type Tile_Group_Cache = {
    [key: string]: Tile_Group;
};

const tile_group_cache: Tile_Group_Cache = {};

export type Tile_Type = {
    name: string;
    valid_tile_types: readonly number[];
    tile_rotation_y?: readonly number[];
};

export type Tiles_Type = {
    [key: string]: Tile_Type;
};

export type Tile_Group = THREE.Group & {
    children: THREE.Mesh[];
};

export type Tile_GLTF = GLTF & {
    nodes: {
        [key: string]: Tile_Group;
    };
};

export function getTile_Type(tile_type: number): Tile_Type {
    const result = valid_tile_types_data[tile_type];
    if (!result) throw "missing valid_tile_types_data";
    return result;
}

export function load_Tile(tt: Tile_Type): Tile_Group {
    if (!tile_group_cache[tt.name])
        tile_group_cache[tt.name] = (useGLTF(url + tt.name + ".glb") as unknown as Tile_GLTF).nodes[tt.name];
    return tile_group_cache[tt.name];
}
