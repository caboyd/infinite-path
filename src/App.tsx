import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls as OrbitControlsType } from "three-stdlib/controls/OrbitControls";
import { AllTiles } from "./Tile";

export const TILE_DIM = 300 as const;
const HALF_DIM = Math.floor(TILE_DIM / 2 + 0.5);

let last_x = 0;

const tile_center = new THREE.Vector3(0, 5, 0);
const max = 7;
const min = 0;

const Tiles = ({
    props,
    orbit_ref,
}: {
    props?: JSX.IntrinsicElements["group"];
    orbit_ref: React.MutableRefObject<OrbitControlsType>;
}) => {
    const [tiles, setTiles] = useState<number[][]>(
        new Array(TILE_DIM)
            .fill(0)
            .map(() => Array.from({ length: TILE_DIM }, () => Math.floor(Math.random() * (max - min + 1) + min)))
    );

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

        //copy tiles
        const new_tiles = tiles.map((a) => a.slice());
        //remove first row
        new_tiles.splice(0, 1);

        const new_row = new Array(TILE_DIM);

        for (let z = 0; z < TILE_DIM; z++) {
            new_row[z] = Math.floor(Math.random() * (max - min + 1) + min);
        }
        new_tiles.push(new_row);

        setTiles(new_tiles);
    });
    const pos = new THREE.Vector3(Math.floor(last_x) - HALF_DIM, 0, -HALF_DIM);
    return (
        <group {...props}>
            <AllTiles {...props} position={pos} grid={tiles} />
        </group>
    );
};

const Scene = () => {
    const orbit_ref = useRef<OrbitControlsType>(null!);

    return (
        <>
            <Tiles orbit_ref={orbit_ref} />
            <ambientLight color={[1, 1, 1]} intensity={0.2} />
            <directionalLight position={[1, 1, 1]} />
            <OrbitControls ref={orbit_ref} />
        </>
    );
};

const App = () => {
    return (
        <Canvas camera={{ fov: 70, position: [-5, 10, 0] }}>
            <Stats />
            <Perf />
            <Suspense>
                <Scene />
            </Suspense>
        </Canvas>
    );
};

export default App;
