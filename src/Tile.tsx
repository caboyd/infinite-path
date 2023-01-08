import { useEffect, useRef } from "react";
import { Group } from "three";
import { load_Tile_GLTF, load_Tile_Straight_GLTF } from "./TileData";

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
