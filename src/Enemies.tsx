import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GetAllWayPoints, PathPosToWorldPos, PathValueisPath, PATH_0 } from "./TileData";

const geo = new THREE.SphereGeometry(0.25, 16, 16);
const mat = new THREE.MeshStandardMaterial({ color: "white" });

const global_enemies: Enemy[] = [];
const path = PATH_0;

let first_render = true;

type WayPoint = THREE.Vector3;

function vec2sqrDist(a_x: number, a_y: number, b_x: number, b_y: number) {
    const x = b_x - a_x;
    const y = b_y - a_y;
    return x * x + y * y;
}

class Enemy extends THREE.Mesh {
    world_start_x: number;
    way_points: WayPoint[] = [];
    speed = 0.5;
    dir: THREE.Vector3 = new THREE.Vector3();

    constructor(grid_start_x: number, world_start_z: number, world_start_x: number) {
        super(geo, mat);
        this.position.set(grid_start_x, 5.25, world_start_z);
        this.world_start_x = world_start_x;
    }

    addWayPoints(way_points: WayPoint[]) {
        this.way_points.push(...way_points);
    }

    update(delta_s: number) {
        //move to next waypoint
        this.dir.set(this.world_start_x + this.way_points[0].x, 0, this.way_points[0].z);
        this.dir.sub(this.position);
        this.dir.y = 0;
        this.dir.normalize();
        this.position.add(this.dir.multiplyScalar(delta_s * this.speed));
        //if at waypoint remove it and look at next waypoint
        if (
            vec2sqrDist(
                this.position.x,
                this.position.z,
                this.world_start_x + this.way_points[0].x,
                this.way_points[0].z
            ) < 0.01
        ) {
            this.way_points.shift();
            if (this.way_points.length == 0) {
                this.addWayPoints(GetAllWayPoints(0, 2));
                this.world_start_x += 20;
            }
            this.lookAt(this.way_points[0]);
        }
    }
}

let last_tile_dimensions = 0;
export function Enemies({
    tile_center,
    latest_row,
    tile_dimensions,
}: {
    tile_center: THREE.Vector3;
    latest_row: string[];
    tile_dimensions: number;
}) {
    if (first_render || last_tile_dimensions !== tile_dimensions) {
        global_enemies.length = 0;
        const offset = (tile_dimensions / 2) % path.length;
        const extra_paths = -Math.floor(tile_dimensions / (path.length * 2)) * path.length;
        //console.log(offset);
        // const e = new Enemy(offset, 7, offset);
        // const wp = GetAllWayPoints(0, 2);
        // e.addWayPoints(wp);
        // global_enemies.push(e);
        first_render = false;

        for (let i = 0; i < tile_dimensions; i++) {
            let grid_start_x = tile_center.x - offset + extra_paths;
            const world_start_x = grid_start_x + i;
            grid_start_x += path.length * Math.floor(i / path.length);
            const path_index = Math.abs(i % path.length);
            //const e = new Enemy(offset2, 7, offset2);
            //find all z values where path exists in row
            const row = path[path_index];
            for (let z = 0; z < row.length; z++) {
                if (PathValueisPath(row[z])) {
                    const e = new Enemy(world_start_x, PathPosToWorldPos(z), grid_start_x);
                    const wp = GetAllWayPoints(path_index, z);
                    if (wp.length === 0) {
                        throw "bad path pos";
                    }
                    e.addWayPoints(wp);
                    global_enemies.push(e);
                }
            }
        }
    }

    last_tile_dimensions = tile_dimensions;

    useFrame((state, delta) => {
        for (let i = 0; i < global_enemies.length; i++) {
            const e = global_enemies[i];
            e.update(delta);
            if (
                e.position.x < tile_center.x - tile_dimensions / 2 ||
                e.position.x > tile_center.x + tile_dimensions / 2
            ) {
                global_enemies.splice(i, 1);
            }
        }
    });

    return (
        <group>
            {global_enemies.map((mesh) => (
                <primitive object={mesh} key={mesh.id}></primitive>
            ))}
        </group>
    );
}
