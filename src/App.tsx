import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls as OrbitControlsType } from "three-stdlib/controls/OrbitControls";
import { RandomTile } from "./Tile";

const TILE_DIM = 35;
const HALF_DIM = Math.floor(TILE_DIM / 2 + 0.5);

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
let last_x = 0;
const tile_center = new THREE.Vector3(0, 0, 0);

const Tiles = (props: JSX.IntrinsicElements["group"]) => {
    const [tiles, setTiles] = useState<JSX.Element[]>();
    const ref = useRef<OrbitControlsType>(null!);

    const genTile = (x: number, z: number) => {
        return <RandomTile position={[x, 0, z]} key={`tile:${index++},x:${x},z:${z}`} />;
    };

    useFrame((state, delta) => {
        const center = tile_center;
        center.x += delta;
        ref.current.object.position.x += delta;
        ref.current.target.copy(tile_center);
        ref.current.update();

        if (!tiles) return;
        const x = Math.floor(center.x + TILE_DIM / 2);
        if (last_x === x) return;
        last_x = x;

        const new_tiles: JSX.Element[] = [];
        for (const tile of tiles) {
            const tile_x = tile.props.position[0];
            if (tile_x > center.x - TILE_DIM / 2 && tile_x < center.x + TILE_DIM / 2) {
                new_tiles.push(tile);
            }
        }

        for (let z0 = -HALF_DIM; z0 < HALF_DIM; z0++) {
            const z = Math.floor(z0 + center.z);
            if (!tilesIncludes(tiles, `x:${x},z:${z}`)) {
                new_tiles.push(genTile(x, z));
            }
        }

        setTiles(new_tiles);
        //console.log(new_tiles.length);
    });
    useThree(({ camera }) => {
        const target = new THREE.Vector3(0, -1, 0);
        target.add(camera.position);
        //camera.lookAt(target);
        if (!ref.current) return;
    });

    useEffect(() => {
        const new_tiles = [];
        for (let z = -HALF_DIM; z < HALF_DIM; z++) {
            for (let x = -HALF_DIM; x <= HALF_DIM; x++) {
                new_tiles.push(genTile(x, z));
            }
        }
        setTiles(new_tiles);
    }, []);

    return (
        <group {...props}>
            {tiles}
            <OrbitControls ref={ref} />
        </group>
    );
};

const Scene = () => {
    return (
        <>
            <Tiles />
            <ambientLight color={[1, 1, 1]} intensity={0.2} />
            <directionalLight position={[1, 1, 1]} />
        </>
    );
};

const App = () => {
    return (
        <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
            <Scene />
        </Canvas>
    );
};

export default App;

useGLTF.preload("./assets/tower-defense-kit/detail_crystal.glb");
