import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import * as THREE from "three";

const url = "./assets/tower-defense-kit/";

export type Tile_Instances = {
    [key: string]: THREE.InstancedMesh;
};

export const tile_data: Tiles_Type = {
    tile: { name: "tile", valid_tile_types: [0, 7] },
    tile_straight: {
        name: "tile_straight",
        valid_tile_types: [1, 2],
        tile_rotation_y: [0, Math.PI / 2],
    },
    tile_cornerSquare: {
        name: "tile_cornerSquare",
        valid_tile_types: [3, 4, 5, 6],
        tile_rotation_y: [0, Math.PI / 2, (2 * Math.PI) / 2, (3 * Math.PI) / 2],
    },

    // tile_rock: { name: "tile_rock", valid_tile_types: [8] },
    tile_tree: { name: "tile_tree", valid_tile_types: [8] },
    tile_treeDouble: { name: "tile_treeDouble", valid_tile_types: [9, 10] },
    tile_treeQuad: { name: "tile_treeQuad", valid_tile_types: [11] },
    tile_hill: { name: "tile_hill", valid_tile_types: [12] },
};

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

const ___ = "___";
const __D = "__D";
const __U = "__U";
const __L = "__L";
const __R = "__R";
const D_R = "D_R";
const D_L = "D_L";
const U_R = "U_R";
const U_L = "U_L";
const R_U = "R_U";
const R_D = "R_D";
const L_U = "L_U";
const L_D = "L_D";

export enum PathValue {
    ___ = "___",
    __D = "__D",
    __U = "__U",
    __L = "__L",
    __R = "__R",
    D_R = "D_R",
    D_L = "D_L",
    U_R = "U_R",
    U_L = "U_L",
    R_U = "R_U",
    R_D = "R_D",
    L_U = "L_U",
    L_D = "L_D",
}

//top right 5
//top left 6
//bottom left 3
//bottom right 4

//20 x 20
//prettier-ignore
export const PATH_0 = [
    [___, ___, __D, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, ___, ___, ___],
    [___, ___, __D, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, ___, ___, ___],
    [___, ___, __D, ___, ___,   ___, ___, ___, ___, U_R,   __R, __R, __R, R_D, ___,   ___, ___, ___, ___, ___],
    [___, ___, __D, ___, ___,   ___, ___, ___, ___, __U,   ___, ___, ___, __D, ___,   ___, ___, ___, ___, ___],
    [___, ___, D_R, __R, __R,   __R, __R, __R, __R, R_U,   ___, ___, ___, D_R, __R,   __R, __R, R_D, ___, ___],

    [___, ___, ___, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, __D, ___, ___],
    [___, ___, ___, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, __D, ___, ___],
    [___, ___, L_D, __L, __L,   __L, __L, __L, __L, U_L,   ___, ___, ___, L_D, __L,   __L, __L, D_L, ___, ___],
    [___, ___, __D, ___, ___,   ___, ___, ___, ___, __U,   ___, ___, ___, __D, ___,   ___, ___, ___, ___, ___],
    [___, ___, __D, ___, ___,   ___, ___, ___, ___, L_U,   __L, __L, __L, D_L, ___,   ___, ___, ___, ___, ___],

    [___, ___, __D, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, ___, ___, ___],
    [___, ___, __D, ___, ___,   U_R, __R, __R, __R, __R,   __R, __R, __R, __R, __R,   __R, __R, R_D, ___, ___],
    [___, ___, __D, ___, ___,   __U, ___, ___, ___, ___,   ___, ___, ___, ___, ___,   ___, ___, __D, ___, ___],
    [___, ___, __D, ___, ___,   __U, ___, ___, ___, L_D,   __L, __L, __L, __L, __L,   U_L, ___, __D, ___, ___],
    [___, ___, __D, ___, ___,   __U, ___, ___, ___, __D,   ___, ___, ___, ___, ___,   __U, ___, __D, ___, ___],

    [___, ___, __D, ___, ___,   __U, ___, ___, ___, __D,   ___, ___, ___, ___, ___,   __U, ___, __D, ___, ___],
    [___, ___, D_R, __R, __R,   R_U, ___, ___, ___, __D,   ___, ___, U_R, __R, __R,   R_U, ___, __D, ___, ___],
    [___, ___, ___, ___, ___,   ___, ___, ___, ___, __D,   ___, ___, __U, ___, ___,   ___, ___, __D, ___, ___],
    [___, ___, ___, ___, ___,   ___, ___, ___, ___, __D,   ___, ___, __U, ___, ___,   ___, ___, __D, ___, ___],
    [___, ___, L_D, __L, __L,   __L, __L, __L, __L, D_L,   ___, ___, L_U, __L, __L,   __L, __L, D_L, ___, ___],
];

export function PathValueToTileNumber(path_value: string): number {
    switch (path_value) {
        case PathValue.___:
            return 0;
        case PathValue.__D:
            return 2;
        case PathValue.__U:
            return 2;
        case PathValue.__L:
            return 1;
        case PathValue.__R:
            return 1;
        case PathValue.D_R:
            return 3;
        case PathValue.D_L:
            return 4;
        case PathValue.U_R:
            return 6;
        case PathValue.U_L:
            return 5;
        case PathValue.R_U:
            return 4;
        case PathValue.R_D:
            return 5;
        case PathValue.L_U:
            return 3;
        case PathValue.L_D:
            return 6;
    }
    return 99;
}

export function GetAllWayPoints(pos_x: number, pos_z: number): THREE.Vector3[] {
    const HALF = PATH_0.length / 2;
    const way_points: THREE.Vector3[] = [];
    let collect_waypoints = false;
    let z = -1;
    let x = 0;
    for (let z0 = 0; z0 < PATH_0[0].length; z0++) {
        if (PATH_0[0][z0] !== PathValue.___) z = z0;
    }

    for (;;) {
        if (x === pos_x && z === pos_z) collect_waypoints = true;
        const v = PATH_0[x][z];

        if (collect_waypoints) {
            if (v[0] !== "_") {
                let real_z = HALF - z - 1;
                if (z > HALF) real_z = -(z - HALF + 1);
                way_points.push(new THREE.Vector3(x, 0, real_z));
            }
        }

        const dir = v[2];
        switch (dir) {
            case "U":
                x--;
                break;
            case "D":
                x++;
                break;
            case "R":
                z++;
                break;
            case "L":
                z--;
                break;
        }
        if (PATH_0[x] === undefined) break;
        if (PATH_0[x][z] === undefined) break;
    }
    return way_points;
}
