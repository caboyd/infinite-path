import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { RandomTile } from "./Tile";
import { useEffect, useState } from "react";

const TILE_DIM = 20;

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
    let last_x = 0;

    const genTile = (x: number, z: number) => {
        return <RandomTile position={[x, 0, z]} key={`tile:${index++},x:${x},z:${z}`} />;
    };

    useFrame((state, delta) => {
        const cam_pos = state.camera.position;
        state.camera.position.x += delta;
        let changed = false;
        new_tiles.length = 0;

        if (!tiles) return;
        const x = Math.ceil(cam_pos.x + TILE_DIM / 2);
        if (last_x === x) return;
        last_x = x;

        for (const tile of tiles) {
            const tile_pos = new Vector3(...tile.props.position);
            if (tile_pos.x > cam_pos.x - TILE_DIM / 2) {
                new_tiles.push(tile);
            } else changed = true;
        }
        const size_z = TILE_DIM;

        for (let z0 = 0; z0 < size_z; z0++) {
            const z = Math.floor(z0 + cam_pos.z - size_z / 2);
            if (!tilesIncludes(tiles, `x:${x},z:${z}`)) {
                changed = true;
                new_tiles.push(genTile(x, z));
            }
        }

        if (changed) setTiles(new_tiles);
        console.log(new_tiles.length);
    });
    useThree(({ camera }) => {
        const target = new Vector3(0, -1, 0);
        target.add(camera.position);
        camera.lookAt(target);
    });

    useEffect(() => {
        const size = TILE_DIM;
        const new_tiles = [];
        for (let z = -size / 2; z < size / 2; z++) {
            for (let x = -size / 2; x <= size / 2; x++) {
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
