import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";

const file = "./assets/tower-defense-kit/tile.glb";

export const RandomTile = (props: JSX.IntrinsicElements["group"]) => {
    const b = Math.random() > 0.5;
    if (b) return <Tile {...props} />;
    else return <Tile_Straight {...props} />;
};

const Tile = (props: JSX.IntrinsicElements["group"]) => {
    //https://gltf.pmnd.rs/
    const { nodes, materials } = load_Tile_GLTF();
    return (
        <group {...props}>
            <mesh castShadow receiveShadow geometry={nodes.Mesh_tile.geometry} material={materials.dirt} />
            <mesh castShadow receiveShadow geometry={nodes.Mesh_tile_1.geometry} material={materials.foliage} />
        </group>
    );
};

const Tile_Straight = (props: JSX.IntrinsicElements["group"]) => {
    const ref = useRef<Group>(null!);

    useEffect(() => {
        ref.current.rotateY(Math.PI / 2);
    }, []);

    //https://gltf.pmnd.rs/
    const { nodes, materials } = load_Tile_Straight_GLTF();
    return (
        <group ref={ref} {...props}>
            <mesh castShadow receiveShadow geometry={nodes.Mesh_tile_straight.geometry} material={materials.dirt} />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh_tile_straight_1.geometry}
                material={materials.foliage}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mesh_tile_straight_2.geometry}
                material={materials.dirtDark}
            />
        </group>
    );
};

useGLTF.preload(file);
function load_Tile_GLTF(): { nodes: any; materials: any } {
    throw new Error("Function not implemented.");
}

function load_Tile_Straight_GLTF(): { nodes: any; materials: any } {
    throw new Error("Function not implemented.");
}
