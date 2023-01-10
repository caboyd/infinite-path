import { useEffect } from "react";
import * as THREE from "three";
import { TILE_DIM } from "./App";
import { getTile_Type, load_Tile, Tile_Instances, Tile_Type } from "./TileData";

const temp: THREE.Object3D = new THREE.Object3D();
const global_instances: Tile_Instances = {};

function getTileInstance(child: THREE.Mesh): THREE.InstancedMesh {
    if (!global_instances[child.name]) {
        let max_instances = TILE_DIM * TILE_DIM;
        if (child.name.includes("tree")) max_instances *= 4;
        global_instances[child.name] = new THREE.InstancedMesh(child.geometry, child.material, max_instances);
        global_instances[child.name].count = 0;
        global_instances[child.name].name = child.name;
    }
    return global_instances[child.name];
}

function resetTileInstancesCount(): void {
    Object.values(global_instances).forEach((instance) => (instance.count = 0));
}

function addTileGroupInstances(
    tile_number: number,
    tile_type: Tile_Type,
    group: THREE.Group,
    x: number,
    z: number
): void {
    const { valid_tile_types, tile_rotation_y } = tile_type;
    let rotation_y = 0;
    if (tile_rotation_y)
        for (let i = 0; i < valid_tile_types.length; i++) {
            if (valid_tile_types[i] === tile_number) rotation_y = tile_rotation_y[i];
        }
    addTileGroupInstancesRecurse(group, x, 5, z, 0, rotation_y, 0, 1, 1, 1);

    function addTileGroupInstancesRecurse(
        group: THREE.Group,
        pos_x: number,
        pos_y: number,
        pos_z: number,
        rot_x: number,
        rot_y: number,
        rot_z: number,
        scale_x: number,
        scale_y: number,
        scale_z: number
    ) {
        for (const child of group.children) {
            if (child instanceof THREE.Mesh) {
                const instance = getTileInstance(child);
                //TODO: Optimize this
                temp.position.set(pos_x, pos_y, pos_z);
                temp.scale.set(scale_x, scale_y, scale_z);
                temp.rotation.set(rot_x, rot_y, rot_z);
                temp.updateMatrix();
                instance.setMatrixAt(instance.count++, temp.matrix);
            }
            if (child instanceof THREE.Group) {
                addTileGroupInstancesRecurse(
                    child,
                    child.position.x + pos_x,
                    child.position.y + pos_y,
                    child.position.z + pos_z,
                    child.rotation.x + rot_x,
                    child.rotation.y + rot_y,
                    child.rotation.z + rot_z,
                    child.scale.x * scale_x,
                    child.scale.x * scale_y,
                    child.scale.x * scale_z
                );
            }
        }
    }
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
    resetTileInstancesCount();

    for (let x = 0; x < grid.length; x++) {
        for (let z = 0; z < grid[x].length; z++) {
            const tile_number = grid[x][z];
            const tile_type = getTile_Type(tile_number);
            const tile_group = load_Tile(tile_type);
            addTileGroupInstances(tile_number, tile_type, tile_group, position.x + x, position.z + z);
        }
    }

    useEffect(() => {
        Object.values(global_instances).forEach((instance) => {
            instance.instanceMatrix.needsUpdate = true;
        });
    });

    return (
        <group {...props}>
            {Object.values(global_instances).map((instance, i) => {
                return <primitive key={`instance${i}-${instance.name}`} object={instance}></primitive>;
            })}
        </group>
    );
}
