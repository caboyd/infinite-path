import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { DirectionalLight, OrthographicCamera } from "three";
import { OrbitControls as OrbitControlsType } from "three-stdlib/controls/OrbitControls";
import { AllTiles } from "./Tile";

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

const Tiles = ({
    props,
    orbit_ref,
    light_ref,
}: {
    props?: JSX.IntrinsicElements["group"];
    orbit_ref: React.MutableRefObject<OrbitControlsType>;
    light_ref: React.MutableRefObject<DirectionalLight>;
}) => {
    const [changed, setChanged] = useState(true);

    useFrame((state, delta) => {
        delta = Math.min(delta, 5 / 60);
        tile_center.x += delta;
        orbit_ref.current.object.position.x += delta;
        orbit_ref.current.target.copy(tile_center);
        orbit_ref.current.update();
        light_ref.current.position.x += delta;
        light_ref.current.target.position.x += delta;
        light_ref.current.target.updateMatrixWorld();

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
    const pos = new THREE.Vector3(Math.floor(last_x) - HALF_DIM, 0, -HALF_DIM);
    return (
        <group {...props}>
            <AllTiles {...props} position={pos} grid={tiles} />
        </group>
    );
};

const Scene = () => {
    const orbit_ref = useRef<OrbitControlsType>(null!);
    const light_ref = useRef<DirectionalLight>(null!);
    const shadow_dim = TILE_DIM / 2;
    const shadow_dim_args: [number, number, number, number, number, number] = [
        -shadow_dim,
        shadow_dim,
        -shadow_dim,
        shadow_dim,
        -shadow_dim,
        shadow_dim,
    ];

    return (
        <>
            <Tiles orbit_ref={orbit_ref} light_ref={light_ref} />
            <ambientLight color={[1, 1, 1]} intensity={0.2} />
            <directionalLight
                ref={light_ref}
                position={[1, 1, 0.5]}
                castShadow={true}
                shadow-mapSize={2048}
                shadow-bias={-0.0018}
            >
                <orthographicCamera attach="shadow-camera" args={shadow_dim_args} />
            </directionalLight>
            <OrbitControls ref={orbit_ref} />
        </>
    );
};

const App = () => {
    return (
        <Canvas camera={{ fov: 70, position: [-5, 10, 0] }} shadows={"soft"}>
            <Stats />
            <Perf />
            <Suspense>
                <Scene />
            </Suspense>
        </Canvas>
    );
};

export default App;
