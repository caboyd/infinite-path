import * as THREE from "three";

import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { OrbitControls } from "three-stdlib";
import { tile_dimensions } from "./App";
import { PATH_0, PathValueToTileNumber } from "./TileData";
import { resetGlobalInstances, TileInstances } from "./TileInstances";
import { Enemies } from "./Enemies";

let last_x = 0;

const tile_center = new THREE.Vector3(0, 5, 0);

const max = 11;
const min = 7;

export const MAX_TILE_TYPES = max + 1;
let tiles: number[][] = [];

const path = PATH_0;

let path_row = 0;
const nextPathRow = () => {
    path_row++;
    if (path_row >= path.length) path_row = 0;
};

export const Tiles = ({
    props,
    camera_speed,
    orbit_ref,
}: {
    props?: JSX.IntrinsicElements["group"];
    camera_speed: number;
    orbit_ref: React.MutableRefObject<OrbitControls>;
}) => {
    const [changed, setChanged] = useState(true);
    const HALF_DIM = Math.floor(tile_dimensions / 2 + 0.5);

    if (tiles.length != tile_dimensions) {
        resetGlobalInstances();
        tiles = new Array(tile_dimensions).fill(0).map(() => Array.from({ length: tile_dimensions }, () => 99));
        path_row = 0;
        for (const row of tiles) {
            fillRow(row);
        }
    }

    useFrame((state, delta) => {
        delta = Math.min(delta, 5 / 60);
        delta *= camera_speed;
        tile_center.x += delta;
        orbit_ref.current.object.position.x += delta;
        orbit_ref.current.target.copy(tile_center);
        orbit_ref.current.update();

        // if (!tiles) return;
        const x = Math.floor(tile_center.x);
        if (last_x === x) return;
        last_x = x;

        //remove first row
        tiles.shift();

        tiles.push(new Array(tile_dimensions));
        const row = tiles[tiles.length - 1];

        fillRow(row);

        setChanged(!changed);
    });

    const top_left = new THREE.Vector3(Math.floor(last_x) - HALF_DIM, tile_center.y, -HALF_DIM);
    const center = new THREE.Vector3(Math.floor(last_x), tile_center.y, 0);
    return (
        <group {...props}>
            <TileInstances {...props} position={top_left} grid={tiles} />;
            <Enemies tile_center={center} tile_dimensions={tile_dimensions}/>
        </group>
    );
};
function fillRow(row: number[]) {
    const middle = Math.floor(row.length / 2);
    const path_half_size = path.length / 2;
    for (let z = 0; z < row.length; z++) {
        row[z] = Math.floor(Math.random() * (max - min + 1) + min);
        if (z >= middle - path_half_size && z < middle + path_half_size) {
            const reverse_index = path_half_size * 2 - 1 - (z - middle + path_half_size);
            row[z] = PathValueToTileNumber(path[path_row][reverse_index]);
        }
    }
    nextPathRow();
}
