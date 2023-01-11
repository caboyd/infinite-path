import * as THREE from "three";

import { useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { DirectionalLight } from "three";
import { OrbitControls } from "three-stdlib";
import { TileInstances } from "./TileInstances";

export const TILE_DIM = 60 as const;
const HALF_DIM = Math.floor(TILE_DIM / 2 + 0.5);

let last_x = 0;

const tile_center = new THREE.Vector3(0, 5, 0);
const max = 7;
const min = 0;

export const MAX_TILE_TYPES = max + 1;
const tiles = new Array(TILE_DIM)
    .fill(0)
    .map(() => Array.from({ length: TILE_DIM }, () => Math.floor(Math.random() * (max - min + 1) + min)));

export const Tiles = ({
    props,
    orbit_ref,
    light_ref,
}: {
    props?: JSX.IntrinsicElements["group"];
    orbit_ref: React.MutableRefObject<OrbitControls>;
    light_ref: React.MutableRefObject<DirectionalLight>;
}) => {
    const [changed, setChanged] = useState(true);

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

        tiles.push(new Array(TILE_DIM));
        const new_row = tiles[tiles.length - 1];

        for (let z = 0; z < TILE_DIM; z++) {
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
