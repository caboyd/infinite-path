import { OrbitControls as OrbitControlsComponent, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useRef } from "react";
import { DirectionalLight } from "three";
import { OrbitControls } from "three-stdlib";
import { useControls } from "leva";
import { Tiles } from "./Tiles";

import * as THREE from "three";

export let tile_dimensions: number;
export let camera_speed: number;

const Scene = () => {
    const orbit_ref = useRef<OrbitControls>(null!);
    const light_ref = useRef<DirectionalLight>(null!);
    const shadow_dim = tile_dimensions / 1.5;
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
            <Tiles
                camera_speed={camera_speed}
                tile_dimensions={tile_dimensions}
                orbit_ref={orbit_ref}
                light_ref={light_ref}
            />
            <ambientLight color={[1, 1, 1]} intensity={0.0} />
            <directionalLight
                ref={light_ref}
                position={[0.1, 2.4, 0.1]}
                color={new THREE.Color(255 / 255, 214 / 255, 224 / 255)}
                intensity={2.0}
                castShadow={true}
                shadow-mapSize={2048}
                shadow-bias={-0.0018}
                shadow-intensity={3.0}
            >
                <orthographicCamera attach="shadow-camera" args={shadow_dim_args} />
            </directionalLight>
            <OrbitControlsComponent ref={orbit_ref} />
            <Environment preset="forest" background environmentIntensity={0.9} />
        </>
    );
};

const App = () => {
    ({ tile_dimensions } = useControls({ tile_dimensions: { value: 40, min: 40, max: 200, step: 20 } }));
    ({ camera_speed } = useControls({ camera_speed: { value: 1, min: 0.5, max: 10, step: 0.5 } }));

    return (
        <Canvas camera={{ fov: 70, position: [-5, 10, 0] }} shadows={"soft"}>
            <Perf position="top-left" />
            <Suspense>
                <Scene />
            </Suspense>
        </Canvas>
    );
};

export default App;
