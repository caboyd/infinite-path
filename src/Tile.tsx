import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { load_Tile, tile_data, Tile_Type } from "./TileData";

const temp = new THREE.Object3D();
export function InstancedTile(tile_type: Tile_Type) {
    return (grid: number[][], position: THREE.Vector3) => {
        const tile_group = useMemo(() => load_Tile(tile_type), []);
        const { valid_tile_types, tile_rotation_y } = tile_type;
        const grid_count = grid.length * grid[0].length;

        const meshes: any = tile_group.children;
        const group_meshes_1 = meshes.map((item: any) => {
            if (item instanceof THREE.Group) return item.children;
        });
        const more_meshes = group_meshes_1.flat(1).filter((e: any) => e !== undefined);
        const all_meshes = [...meshes, ...more_meshes];

        const node_count = all_meshes.length;
        // if (Math.random() > 0.5) node_count--;
        const refs = Array.from({ length: node_count }, () => useRef<THREE.InstancedMesh>(null!));
        let instance_count = 0;

        useEffect(() => {
            for (let x = 0; x < grid.length; x++) {
                for (let z = 0; z < grid[x].length; z++) {
                    const tile_type = grid[x][z];
                    //pass in func and other poo to customize this
                    if (!valid_tile_types.includes(tile_type)) continue;
                    temp.position.set(position.x + x, 0, position.z + z);
                    if (tile_rotation_y)
                        for (let i = 0; i < valid_tile_types.length; i++) {
                            if (valid_tile_types[i] === tile_type) temp.rotateY(tile_rotation_y[i]);
                        }
                    temp.updateMatrix();
                    refs[0].current.setMatrixAt(instance_count++, temp.matrix);
                    //undo for reuse
                    if (tile_rotation_y) temp.rotation.set(0, 0, 0);
                }
            }
            refs[0].current.instanceMatrix.needsUpdate = true;
            refs[0].current.count = instance_count;
            for (const ref of refs) {
                ref.current.instanceMatrix = refs[0].current.instanceMatrix;
                ref.current.count = refs[0].current.count;
            }
        });

        return (
            <>
                {Array.from({ length: node_count }).map((_, i) => (
                    <instancedMesh
                        key={i}
                        ref={refs[i]}
                        args={[all_meshes[i].geometry, all_meshes[i].material, grid_count]}
                    ></instancedMesh>
                ))}
            </>
        );
    };
}

export function AllTiles({
    grid,
    position,
    props,
}: {
    grid: number[][];
    position: THREE.Vector3;
    props?: JSX.IntrinsicElements["group"];
}) {
    return (
        <group {...props}>
            <Tile grid={grid} position={position} />
            <TileStraight grid={grid} position={position} />
            <TileRock grid={grid} position={position} />
            <TileTree grid={grid} position={position} />
        </group>
    );
}

export function Tile({ grid, position }: { grid: number[][]; position: THREE.Vector3 }) {
    return InstancedTile(tile_data.tile)(grid, position);
}

export function TileStraight({ grid, position }: { grid: number[][]; position: THREE.Vector3 }) {
    return InstancedTile(tile_data.tile_straight)(grid, position);
}

export function TileRock({ grid, position }: { grid: number[][]; position: THREE.Vector3 }) {
    return InstancedTile(tile_data.tile_rock)(grid, position);
}

export function TileTree({ grid, position }: { grid: number[][]; position: THREE.Vector3 }) {
    return InstancedTile(tile_data.tile_tree)(grid, position);
}
