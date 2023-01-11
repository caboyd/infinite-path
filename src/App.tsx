import { OrbitControls as OrbitControlsComponent, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useRef } from "react";
import { DirectionalLight } from "three";
import { OrbitControls } from "three-stdlib";

import { Tiles, TILE_DIM } from "./Tiles";

const Scene = () => {
    const orbit_ref = useRef<OrbitControls>(null!);
    const light_ref = useRef<DirectionalLight>(null!);
    const shadow_dim = TILE_DIM / 1.5;
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
            <OrbitControlsComponent ref={orbit_ref} />
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
