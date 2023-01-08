import { OrbitControls, Sphere, Trail, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import { RandomTile } from "./Tile";

const Scene = () => {
    const ref = useRef<Mesh>(null!);
    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        const delta = clock.getDelta();
        ref.current.rotation.y += delta;
        const pos = ref.current.position;
        pos.y = 1;
        pos.x = Math.cos(time);
        pos.z = Math.sin(time * 2) / 2;
    });

    const tiles = [];
    const size = 20;
    for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
            tiles.push(<RandomTile position={[x - size / 2, 0, z - size / 2]} key={`x:${x},z${z}`} />);
        }
    }

    return (
        <>
            {tiles}
            <Trail
                width={1}
                length={12}
                color={"#F8D628"}
                attenuation={(t: number) => {
                    return t * t;
                }}
            >
                <Sphere ref={ref} args={[0.1, 32, 16]} rotation={[0.5, 0, 0]}>
                    <meshNormalMaterial />
                </Sphere>
            </Trail>
            <ambientLight color={[1, 1, 1]} intensity={0.2} />
            <directionalLight position={[1, 1, 1]} />
        </>
    );
};

const App = () => {
    return (
        <Canvas camera={{ fov: 70, position: [1, 3, 1] }}>
            <OrbitControls />
            <Scene />
        </Canvas>
    );
};

export default App;

useGLTF.preload("./assets/tower-defense-kit/detail_crystal.glb");
