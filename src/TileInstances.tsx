import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { tile_dimensions as TILE_DIM } from "./App";
import { getTile_Type, load_Tile, Tile_Instances, Tile_Type } from "./TileData";

const global_instances: Tile_Instances = {};
function getTileInstance(child: THREE.Mesh): THREE.InstancedMesh {
    if (!global_instances[child.name]) {
        let max_instances = (TILE_DIM * TILE_DIM) / 2;
        if (child.name.includes("tree")) max_instances *= 6;
        const instance = new THREE.InstancedMesh(child.geometry, child.material, max_instances);
        global_instances[child.name] = instance;
        instance.count = 0;
        instance.name = child.name;
        instance.receiveShadow = true;
        instance.castShadow = true;
    }
    return global_instances[child.name];
}

function resetTileInstancesCount(): void {
    Object.values(global_instances).forEach((instance) => (instance.count = 0));
}

export function resetGlobalInstances(): void {
    for (const key in global_instances) {
        if (global_instances[key]) {
            delete global_instances[key];
        }
    }
}

async function addTileGroupInstances(
    tile_number: number,
    tile_type: Tile_Type,
    group: THREE.Group,
    x: number,
    z: number
): Promise<void> {
    const { valid_tile_types, tile_rotation_y } = tile_type;
    let rotation_y = 0;
    if (tile_rotation_y)
        for (let i = 0; i < valid_tile_types.length; i++) {
            if (valid_tile_types[i] === tile_number) rotation_y = tile_rotation_y[i];
        }
    addTileGroupInstancesRecurse(group, x, 5, z, rotation_y, 1, 1, 1);

    function addTileGroupInstancesRecurse(
        group: THREE.Group,
        pos_x: number,
        pos_y: number,
        pos_z: number,
        rot_y: number,
        scale_x: number,
        scale_y: number,
        scale_z: number
    ) {
        for (const child of group.children) {
            if (child instanceof THREE.Mesh) {
                const instance = getTileInstance(child);
                if (instance.count == instance.instanceMatrix.count) {
                    console.warn(`too many instances for ${instance.name}`);
                    continue;
                }

                //This is done because it is much faster and doesnt require mem alloc
                //Note: Only allows rotation on y axis
                //Composition matrix of position matrix * rotation matrix * scale matrix
                //({
                //      {scale_x*cos(t),    0,          scale_z*sin(t),     pos_x},
                //      {0,                 scale_y,    0,                  pos_y},
                //      {-scale_x*sin(t),   0,          scale_z*cos(t),     pos_z},
                //      {0,                 0,          0,                  1    }
                //})

                const offset = instance.count * 16;
                const array = instance.instanceMatrix.array as Float32Array;
                const cost = Math.cos(rot_y);
                const sint = Math.sin(rot_y);
                //composition matrix is in row major but array is column major
                array[offset + 0] = scale_x * cost;
                array[offset + 4] = 0;
                array[offset + 8] = scale_z * sint;
                array[offset + 12] = pos_x;

                array[offset + 1] = 0;
                array[offset + 5] = scale_y;
                array[offset + 9] = 0;
                array[offset + 13] = pos_y;

                array[offset + 2] = -scale_x * sint;
                array[offset + 6] = 0;
                array[offset + 10] = scale_z * cost;
                array[offset + 14] = pos_z;

                array[offset + 3] = 0;
                array[offset + 7] = 0;
                array[offset + 11] = 0;
                array[offset + 15] = 1;
                instance.count++;
            }
            if (child instanceof THREE.Group) {
                addTileGroupInstancesRecurse(
                    child,
                    child.position.x + pos_x,
                    child.position.y + pos_y,
                    child.position.z + pos_z,
                    child.rotation.y + rot_y,
                    child.scale.x * scale_x,
                    child.scale.x * scale_y,
                    child.scale.x * scale_z
                );
            }
        }
    }
}

export function TileInstances({
    grid,
    position,
    props,
}: {
    grid: number[][];
    position: THREE.Vector3;
    props?: JSX.IntrinsicElements["group"];
}) {
    resetTileInstancesCount();
    const instance_needs_update = Array.from({ length: Object.keys(global_instances).length }, () => true);
    const global_instances_arr = Object.values(global_instances);

    for (let x = 0; x < grid.length; x++) {
        for (let z = 0; z < grid[x].length; z++) {
            const tile_number = grid[x][z];
            const tile_type = getTile_Type(tile_number);
            const tile_group = load_Tile(tile_type);
            addTileGroupInstances(tile_number, tile_type, tile_group, position.x + x, position.z + z);
        }
    }

    useFrame(() => {
        const max_per_frame = 2;
        let per_frame = 0;
        for (let i = 0; i < instance_needs_update.length; i++) {
            if (instance_needs_update[i] == true) {
                per_frame++;
                //only max_per_frame to gpu at a time
                global_instances_arr[i].instanceMatrix.needsUpdate = true;
                instance_needs_update[i] = false;
                if (per_frame === max_per_frame) break;
            }
        }
    });

    return (
        <group {...props}>
            {Object.values(global_instances).map((instance, i) => {
                return <primitive key={`instance${i}-${instance.name}`} object={instance}></primitive>;
            })}
        </group>
    );
}
