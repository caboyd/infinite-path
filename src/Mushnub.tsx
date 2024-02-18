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

interface MushnubsProps {
    positions: THREE.Vector3[];
}

export function Mushnubs(props: MushnubsProps) {
    const { nodes, materials } = useGLTF("assets/ultimate-monsters/Mushnub.gltf");
    return (
        <group>
            {/*  
            //@ts-ignore    */}
            <Instances range={props.positions.length} material={materials.Atlas} geometry={nodes.Mushnub_Blob.geometry}>
                {props.positions.map((position, i) => (
                    <Mushnub key={i} position={position} color={new THREE.Color()} />
                ))}
            </Instances>
        </group>
    );
}

interface MushnubProps {
    position: THREE.Vector3;
    color: THREE.Color;
}

function Mushnub(props: MushnubProps) {
    const ref = useRef<THREE.Group & { color: THREE.Color }>(null);
    const [hovered, setHover] = useState(false);
    useFrame((state) => {
        if (!ref.current) return;
        ref.current.scale.x =
            ref.current.scale.y =
            ref.current.scale.z =
                THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 0.3 : 0.25, 0.1);
        ref.current.color.lerp(props.color.set(hovered ? "red" : "white"), hovered ? 1 : 0.1);
        Object.assign(ref.current.position, props.position);
        //ref.current.position = props.position;
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

// export function Mushnub(props?: JSX.IntrinsicElements["group"], world_start_x: number) {
//     const ref = useRef<THREE.Group>(null);
//     const { nodes, materials, animations } = useGLTF("assets/ultimate-monsters/Mushnub.gltf");
//     // const { actions } = useAnimations(animations, group);

//     useFrame((delta_s: number) => {});

//     return (
//         <group {...props} dispose={null}>
//             <group name="Scene">
//                 <group name="CharacterArmature">
//                     <skinnedMesh
//                         name="Mushnub_Blob"
//                         geometry={nodes.Mushnub_Blob.geometry}
//                         material={materials.Atlas}
//                         skeleton={nodes.Mushnub_Blob.skeleton}
//                     />
//                     <primitive object={nodes.Body} />
//                     <primitive object={nodes.Head} />
//                 </group>
//             </group>
//         </group>
//     );
// }

useGLTF.preload("assets/ultimate-monsters/Mushnub.gltf");
