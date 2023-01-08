import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { RandomTile } from "./Tile";
import { useEffect, useState } from "react";

function tilesIncludes(tiles: JSX.Element[], key: string): boolean {
    let result = false;
    tiles.findIndex((tile) => {
        const k = tile.key;
        if (typeof k === "string") {
            if (k.includes(key)) {
                result = true;
                return true;
            }
        }
    });
    return result;
}

let index = 0;
const Scene = (props: JSX.IntrinsicElements["group"]) => {
    const [tiles, setTiles] = useState<JSX.Element[]>();
    const new_tiles: JSX.Element[] = [];

    const genTile = (x: number, z: number) => {
        return <RandomTile position={[x, 0, z]} key={`tile:${index++},x:${x},z:${z}`} />;
    };

    useFrame((state, delta) => {
        const cam_pos = state.camera.position;
        state.camera.position.x += delta;
        // state.camera.position.z -= delta;
        new_tiles.length = 0;

        if (!tiles) return;
        for (const tile of tiles) {
            const tile_pos = new Vector3(...tile.props.position);
            if (tile_pos.x > cam_pos.x - 20) {
                new_tiles.push(tile);
            }
        }
        const size_z = 30;
        const size_x = 20;
        for (let x0 = size_x / 2; x0 <= size_x; x0++) {
            const x = Math.ceil(x0 + cam_pos.x - size_x / 2);
            if (tilesIncludes(tiles, `x:${x}`)) continue;
            for (let z0 = 0; z0 < size_z; z0++) {
                const z = Math.floor(z0 + cam_pos.z - size_z / 2);
                if (!tilesIncludes(tiles, `x:${x},z:${z}`)) {
                    new_tiles.push(genTile(x, z));
                }
            }
        }
        setTiles(new_tiles);
        console.log(new_tiles.length);
    });
    useThree(({ camera }) => {
        const target = new Vector3(0, -1, 0);
        target.add(camera.position);
        camera.lookAt(target);
    });

    useEffect(() => {
        const size = 15;
        const new_tiles = [];
        for (let z = -size; z < size; z++) {
            for (let x = -size; x < size; x++) {
                new_tiles.push(genTile(x, z));
            }
        }
        setTiles(new_tiles);
    }, []);

    return (
        <group {...props} dispose={null}>
            {tiles}
            <ambientLight color={[1, 1, 1]} intensity={0.2} />
            <directionalLight position={[1, 1, 1]} />
        </group>
    );
};

const App = () => {
    return (
        <Canvas camera={{ fov: 70, position: [0, 25, 0] }}>
            {/* <OrbitControls /> */}
            <Scene />
        </Canvas>
    );
};

export default App;

useGLTF.preload("./assets/tower-defense-kit/detail_crystal.glb");
