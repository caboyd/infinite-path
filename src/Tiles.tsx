import * as THREE from "three";

import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { DirectionalLight } from "three";
import { OrbitControls } from "three-stdlib";
import { resetGlobalInstances, TileInstances } from "./TileInstances";
import { PATH_0 } from "./TileData";

//export const TILE_DIM = 60 as const;

let last_x = 0;

const tile_center = new THREE.Vector3(0, 5, 0);
const max = 6;
const min = 11;

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
    tile_dimensions,
    orbit_ref,
    light_ref,
}: {
    props?: JSX.IntrinsicElements["group"];
    tile_dimensions: number;
    orbit_ref: React.MutableRefObject<OrbitControls>;
    light_ref: React.MutableRefObject<DirectionalLight>;
}) => {
    const [changed, setChanged] = useState(true);
    const HALF_DIM = Math.floor(tile_dimensions / 2 + 0.5);

    if (tiles.length != tile_dimensions) {
        resetGlobalInstances();
        tiles = new Array(tile_dimensions).fill(0).map(() => Array.from({ length: tile_dimensions }, () => 99));
        for (const row of tiles) {
            const middle = Math.floor(row.length / 2);
            const path_half_size = path.length / 2;
            for (let z = 0; z < row.length; z++) {
                row[z] = Math.floor(Math.random() * (max - min + 1) + min);
                if (z >= middle - path_half_size && z < middle + path_half_size) {
                    const reverse_index = (path_half_size*2-1) - (z - middle + path_half_size)
                    row[z] = path[path_row][reverse_index];
                }
            }
            nextPathRow();
        }
    }

    useFrame((state, delta) => {
        delta = Math.min(delta, 5 / 60);
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

        for (let z = 0; z < tile_dimensions; z++) {
            row[z] = Math.floor(Math.random() * (max - min + 1) + min);
            const middle = Math.floor(row.length / 2);
            const path_half_size = path.length / 2;

            if (z >= middle - path_half_size && z < middle + path_half_size) {
                const reverse_index = (path_half_size*2-1) - (z - middle + path_half_size)
                row[z] = path[path_row][reverse_index];
            }
        }

        nextPathRow();
        setChanged(!changed);
    });

    useEffect(() => {
        light_ref.current.position.x = tile_center.x;
        light_ref.current.target.position.x = tile_center.x - 1;
        light_ref.current.target.updateMatrixWorld();
    }, [changed]);

    const pos = new THREE.Vector3(Math.floor(last_x) - HALF_DIM, 0, -HALF_DIM);
    return (
        <group {...props}>
            <TileInstances {...props} position={pos} grid={tiles} />
        </group>
    );
};
