import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { Group } from "three";
import { Tile_GLTF, Tile_Straight_GLTF } from "./TileData";

const file = "./assets/tower-defense-kit/tile.glb";

function load_Tile_GLTF(): Tile_GLTF {
    return useGLTF("./assets/tower-defense-kit/tile.glb") as unknown as Tile_GLTF;
}

function load_Tile_Straight_GLTF(): Tile_Straight_GLTF {
    return useGLTF("./assets/tower-defense-kit/tile_straight.glb") as unknown as Tile_Straight_GLTF;
}

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
