import { OrbitControls, Sphere, Trail } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

const Scene = () => {
    const ref = useRef<Mesh>(null!);
    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        const delta = clock.getDelta();
        ref.current.rotation.y += delta;
        const pos = ref.current.position;
        pos.x = Math.cos(time);
        pos.y = Math.sin(time * 2) / 2;
    });

    return (
        <>
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
            <ambientLight />
        </>
    );
};

const App = () => {
    return (
        <Canvas camera={{ fov: 70, position: [0, 0, 3] }}>
            <OrbitControls />
            <Scene />
        </Canvas>
    );
};

export default App;
