/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Instance, Instances, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { Enemy } from "./Enemies";

export const EnemyModelTypes = ["Mushnub", "Cactoro"] as const;
export type EnemyModelType = (typeof EnemyModelTypes)[number];

const DEFAULT_SCALE = 0.2;

type CactoroResult = GLTF & {
    nodes: {
        Cactoro_Blob: THREE.SkinnedMesh;
        Cactoro_Blob001: THREE.SkinnedMesh;
        Body: THREE.Bone;
        Head: THREE.Bone;
    };
    materials: {
        Atlas: THREE.MeshStandardMaterial;
    };
};

type MushnubResult = GLTF & {
    nodes: {
        Mushnub_Blob: THREE.SkinnedMesh;
        Body: THREE.Bone;
        Head: THREE.Bone;
    };
    materials: {
        Atlas: THREE.MeshStandardMaterial;
    };
};

interface EnemyInstancesProps {
    enemies: Enemy[];
    ranges: { [k: string]: number };
}

export function EnemyInstances(props: EnemyInstancesProps) {
    const mushnub: MushnubResult = useGLTF("assets/ultimate-monsters/Mushnub.gltf") as MushnubResult;
    const cactoro: CactoroResult = useGLTF("assets/ultimate-monsters/Cactoro.gltf") as CactoroResult;

    return (
        <>
            <EnemyModelInstances
                range={props.ranges[EnemyModelTypes[0]]}
                geometry={[mushnub.nodes.Mushnub_Blob.geometry]}
                material={mushnub.materials.Atlas}
                limit={750}
                enemies={props.enemies}
                enemy_type={EnemyModelTypes[0]}
            />
            <EnemyModelInstances
                range={props.ranges[EnemyModelTypes[1]]}
                geometry={[cactoro.nodes.Cactoro_Blob.geometry, cactoro.nodes.Cactoro_Blob001.geometry]}
                material={cactoro.materials.Atlas}
                limit={750}
                enemies={props.enemies}
                enemy_type={EnemyModelTypes[1]}
            />
        </>
    );
}

interface EnemyModelInstancesProps {
    geometry: THREE.BufferGeometry[];
    material: THREE.Material | THREE.Material[] | undefined;
    range: number;
    limit: number;
    enemies: Enemy[];
    enemy_type: EnemyModelType;
}

function EnemyModelInstances(props: EnemyModelInstancesProps) {
    return props.geometry.map((geometry, g_index) => {
        return (
            <Instances
                key={g_index}
                geometry={geometry}
                range={props.range}
                material={props.material}
                castShadow
                frustumCulled={false}
                limit={800}
            >
                {props.enemies.map((enemy, i) => {
                    if (enemy.enemy_type == props.enemy_type)
                        return <EnemyModelInstance key={enemy.id} color={new THREE.Color()} enemy={enemy} />;
                })}
            </Instances>
        );
    });
}

interface EnemyModelInstanceProps {
    enemy: Enemy;
    color: THREE.Color;
}

const color_bright = new THREE.Color(2, 2, 2);
const color_white = new THREE.Color("white");

function EnemyModelInstance(props: EnemyModelInstanceProps) {
    const ref = useRef<THREE.Group & { color: THREE.Color }>(null);
    const setHover = (v: boolean) => (props.enemy.hovered = v);

    useFrame((state) => {
        if (!ref.current) return;
        let e = props.enemy;
        let hovered = props.enemy.hovered;
        ref.current.scale.x =
            ref.current.scale.y =
            ref.current.scale.z =
                THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 2 * DEFAULT_SCALE : DEFAULT_SCALE, 0.05);
        ref.current.color.lerp(props.color.set(hovered ? color_bright : color_white), hovered ? 0.4 : 0.1);
        ref.current.position.copy(e.position);
        ref.current.rotation.y = e.rotation.y;
    });
    return (
        <Instance
            ref={ref}
            scale={DEFAULT_SCALE}
            onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
            onPointerOut={(e) => setHover(false)}
        />
    );
}

useGLTF.preload("assets/ultimate-monsters/Mushnub.gltf");
useGLTF.preload("assets/ultimate-monsters/Cactoro.gltf");
