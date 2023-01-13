import * as THREE from "three";

import { useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { DirectionalLight } from "three";
import { OrbitControls } from "three-stdlib";
import { resetGlobalInstances, TileInstances } from "./TileInstances";
import { useControls } from "leva";

//export const TILE_DIM = 60 as const;

let last_x = 0;

const tile_center = new THREE.Vector3(0, 5, 0);
const max = 7;
const min = 0;

export const MAX_TILE_TYPES = max + 1;
let tiles: number[][] = [];

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
        tiles = new Array(tile_dimensions)
            .fill(0)
            .map(() =>
                Array.from({ length: tile_dimensions }, () => Math.floor(Math.random() * (max - min + 1) + min))
            );
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
        const new_row = tiles[tiles.length - 1];

        for (let z = 0; z < tile_dimensions; z++) {
            new_row[z] = Math.floor(Math.random() * (max - min + 1) + min);
        }

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
