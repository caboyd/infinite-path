import { Environment, OrbitControls as OrbitControlsComponent } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Suspense, useRef } from "react";
import { DirectionalLight } from "three";
import { OrbitControls } from "three-stdlib";
import { Tiles } from "./Tiles";

import * as THREE from "three";

export let tile_dimensions: number;
export let camera_speed: number;

const Scene = () => {
    const orbit_ref = useRef<OrbitControls>(null!);
    const light_ref = useRef<DirectionalLight>(null!);
    const light_dir = new THREE.Vector3(1.1, 2.4, 0.4);
    const shadow_dim = 20;
    const shadow_dim_args: [number, number, number, number, number, number] = [
        -shadow_dim,
        shadow_dim,
        -shadow_dim,
        shadow_dim,
        -shadow_dim,
        shadow_dim,
    ];

    useFrame((state, delta) => {
        const camera = state.camera;
        light_ref.current.position.copy(camera.position);
        light_ref.current.target.position.copy(camera.position);
        light_ref.current.target.position.sub(light_dir);
        light_ref.current.updateMatrixWorld();
        light_ref.current.target.updateMatrixWorld();
    });

    return (
        <>
            <Tiles camera_speed={camera_speed} orbit_ref={orbit_ref} />

            <ambientLight color={[1, 1, 1]} intensity={0.0} />
            <directionalLight
                ref={light_ref}
                color={new THREE.Color(255 / 255, 214 / 255, 224 / 255)}
                intensity={2.0}
                castShadow={true}
                shadow-mapSize={2048}
                shadow-bias={-0.0018}
                shadow-normalBias={0.05}
                shadow-intensity={4.0}
            >
                <orthographicCamera attach="shadow-camera" args={shadow_dim_args} />
            </directionalLight>
            <OrbitControlsComponent ref={orbit_ref} />
            <Environment preset="forest" background environmentIntensity={0.9} />
            <EffectComposer enableNormalPass>
                <N8AO color="black" aoRadius={1} intensity={1} aoSamples={6} denoiseSamples={4} />
                <Bloom mipmapBlur levels={7} intensity={1} />
                <SMAA />
            </EffectComposer>
        </>
    );
};

const App = () => {
    ({ tile_dimensions } = useControls({ tile_dimensions: { value: 60, min: 40, max: 200, step: 20 } }));
    ({ camera_speed } = useControls({ camera_speed: { value: 1, min: 0.0, max: 8, step: 0.5 } }));
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
