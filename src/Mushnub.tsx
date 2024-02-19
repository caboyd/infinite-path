/* eslint-disable @typescript-eslint/ban-ts-comment */

const randomVector = (r: number) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r];
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
type Data = {
    random: number;
    position: number[];
    rotation: number[];
}[];
const data: Data = Array.from({ length: 1000 }, (_, i) => ({
    random: Math.random(),
    position: randomVector(i),
    rotation: randomEuler(),
}));

import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Instances, Instance } from "@react-three/drei";
import { Enemy } from "./Enemies";

interface MushnubsProps {
    enemies: Enemy[];
}

export function Mushnubs(props: MushnubsProps) {
    const { nodes, materials } = useGLTF("assets/ultimate-monsters/Mushnub.gltf");
    //@ts-ignore
    materials.Atlas.envMapIntensity = 0.5;

    return (
        <group>
            {/* @ts-ignore */}
            <Instances  geometry={nodes.Mushnub_Blob.geometry}
                range={props.enemies.length}
                material={materials.Atlas}
                castShadow
            >
                {props.enemies.map((enemy, i) => {
                    return (
                        <Mushnub
                            key={enemy.id}
                            id={enemy.id}
                            index={i}
                            position={enemy.position}
                            rotation={enemy.rotation}
                            color={new THREE.Color()}
                        />
                    );
                })}
            </Instances>
        </group>
    );
}

interface MushnubProps {
    id: number;
    index: number;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    color: THREE.Color;
}

function Mushnub(props: MushnubProps) {
    const ref = useRef<THREE.Group & { color: THREE.Color } & { hovered: boolean }>(null);
    const [hovered, setHover] = useState(false);
    useFrame((state) => {
        if (!ref.current) return;
        ref.current.scale.x =
            ref.current.scale.y =
            ref.current.scale.z =
                THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 0.4 : 0.2, 0.05);
        ref.current.color.lerp(props.color.set(hovered ? "red" : "white"), hovered ? 0.6 : 0.1);
        Object.assign(ref.current.position, props.position);
        ref.current.rotation.y = props.rotation.y;
    });
    return (
        <group>
            <Instance
                ref={ref}
                onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
                onPointerOut={(e) => setHover(false)}
            />
        </group>
    );
}

useGLTF.preload("assets/ultimate-monsters/Mushnub.gltf");
