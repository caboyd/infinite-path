import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { load_Tile_GLTF, load_Tile_Straight_GLTF, Tile_Group } from "./TileData";

export function InstancedTile(tile_group: Tile_Group, valid_tile_types: number[], tile_rotation_y?: number[]) {
    return ({ grid, position }: { grid: number[][]; position: THREE.Vector3 }) => {
        const grid_count = grid.length * grid[0].length;

        const node_count = Object.keys(tile_group.children).length;
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

        const meshes = tile_group.children;
        return (
            <>
                {Array.from({ length: node_count }).map((_, i) => {
                    return (
                        <instancedMesh
                            key={i}
                            ref={refs[i]}
                            args={[meshes[i].geometry, meshes[i].material, grid_count]}
                        ></instancedMesh>
                    );
                })}
            </>
        );
    };
}

const temp = new THREE.Object3D();
export function Tile({ grid, position }: { grid: number[][]; position: THREE.Vector3 }) {
    const model = useMemo(() => load_Tile_GLTF(), []);
    return InstancedTile(model.nodes.tile, [0])({ grid, position });
}

export function TileStraight({ grid, position }: { grid: number[][]; position: THREE.Vector3 }) {
    const model = useMemo(() => load_Tile_Straight_GLTF(), []);
    return InstancedTile(model.nodes.tile_straight, [1, 2], [0, Math.PI / 2])({ grid, position });
}
