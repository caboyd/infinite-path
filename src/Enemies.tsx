import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";
import { EnemyInstances, EnemyModelType, EnemyModelTypes } from "./EnemyModels";
import { GetAllWayPoints, PATH_0, PathPosToWorldPos, PathValueisPath } from "./TileData";

let enemy_speed: number;

const global_enemies: Enemy[] = [];
const global_enemy_ranges = Object.fromEntries(EnemyModelTypes.map((o) => [o, 0]));

let cur_model = -1;
function getNextEnemyModelType() {
    cur_model += 1;
    if (cur_model >= EnemyModelTypes.length) cur_model = 0;
    return EnemyModelTypes[cur_model];
}

const path = PATH_0;

let first_render = true;

type WayPoint = THREE.Vector3;

function vec2sqrDist(a_x: number, a_y: number, b_x: number, b_y: number) {
    const x = b_x - a_x;
    const y = b_y - a_y;
    return x * x + y * y;
}

function lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
}

export class Enemy extends THREE.Object3D {
    world_start_x: number;
    way_points: WayPoint[] = [];
    speed = 0.5;
    dir: THREE.Vector3 = new THREE.Vector3();
    velocity: THREE.Vector3 = new THREE.Vector3();
    current_dir: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    marked_for_delete = false;
    enemy_type: EnemyModelType;
    hovered: boolean = false;

    constructor(enemy_type: EnemyModelType, grid_start_x: number, world_start_z: number, world_start_x: number) {
        super();
        this.position.set(grid_start_x, 5.1, world_start_z);
        this.world_start_x = world_start_x;
        this.frustumCulled = false;
        this.speed = enemy_speed;
        this.enemy_type = enemy_type;
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

        this.velocity.copy(this.dir);
        this.velocity.multiplyScalar(delta_s * this.speed);
        this.position.add(this.velocity);

        //apply lerp rotation only if necessary
        if (this.current_dir.distanceToSquared(this.dir) > 0.005) {
            this.current_dir.lerp(this.dir, 0.04);
            const angle = Math.atan2(this.current_dir.x, this.current_dir.z);
            this.rotation.y = angle;
        }

        //if at waypoint remove it and look at next waypoint
        if (
            vec2sqrDist(
                this.position.x,
                this.position.z,
                this.world_start_x + this.way_points[0].x,
                this.way_points[0].z
            ) < 0.005
        ) {
            this.way_points.shift();
            if (this.way_points.length == 0) {
                //delete out of bounds enemies that have reached last waypoint because the newly spanwed one will overlap them
                if (this.position.x > last_tile_center.x + last_tile_dimensions / 2) {
                    this.marked_for_delete = true;
                }
                this.addWayPoints(GetAllWayPoints(0, 2));
                this.world_start_x += 20;
            }
            //this.lookAt(this.way_points[0]);
        }
    }
}

let last_tile_dimensions = 0;
let last_tile_center = new THREE.Vector3();
let tile_center_x_of_last_spawn = 0;

//The amount to offset the grid so enemy spawns line up properly
//offset happens when grid size is changed
let tile_center_x_grid_offset = 20;

export function Enemies({ tile_center, tile_dimensions }: { tile_center: THREE.Vector3, tile_dimensions:number }) {
    ({ enemy_speed } = useControls({ enemy_speed: { value: 0.5, min: 0.0, max: 2, step: 0.1 } }));

    if (first_render || last_tile_dimensions !== tile_dimensions) {
        global_enemies.length = 0;
        let enemy_model_type = getNextEnemyModelType();

        const offset = (tile_dimensions / 2) % path.length;
        const extra_paths = -Math.floor(tile_dimensions / (path.length * 2)) * path.length;
        first_render = false;
        tile_center_x_grid_offset = 20 - (tile_center.x % 20);
        tile_center_x_of_last_spawn = tile_center.x;

        const tile_end = tile_dimensions + 20 - (tile_center.x % 20);

        for (let i = 0; i < tile_end; i++) {
            let grid_start_x = tile_center.x - offset + extra_paths;
            const world_start_x = grid_start_x + i;
            grid_start_x += path.length * Math.floor(i / path.length);
            const path_index = Math.abs(i % path.length);
            //find all z values where path exists in row
            const row = path[path_index];

            if (i % 20 == 0) enemy_model_type = getNextEnemyModelType();

            for (let z = 0; z < row.length; z++) {
                if (PathValueisPath(row[z])) {
                    const e = new Enemy(enemy_model_type, world_start_x, PathPosToWorldPos(z), grid_start_x);
                    global_enemy_ranges[enemy_model_type] += 1;
                    const wp = GetAllWayPoints(path_index, z);
                    if (wp.length === 0) {
                        throw "bad path pos";
                    }
                    e.addWayPoints(wp);
                    global_enemies.push(e);
                }
            }
        }
        console.log("first")
    }
    //console.log(tile_center.x, tile_center_x_grid_offset + tile_center.x);
    const make_new_enemies = (tile_center_x_grid_offset + tile_center.x) % 20 == 0;
    if (!first_render && tile_center_x_of_last_spawn !== tile_center.x && make_new_enemies) {
        const enemy_model_type = getNextEnemyModelType();

        const offset = (tile_dimensions / 2) % path.length;
        const extra_paths = -Math.floor(tile_dimensions / (path.length * 2)) * path.length;
        tile_center_x_of_last_spawn = tile_center.x;
        let enemies_added = 0;
        for (let i = tile_dimensions; i < Math.ceil(tile_dimensions + 20); i++) {
            let grid_start_x = tile_center.x - offset + extra_paths;
            const world_start_x = grid_start_x + i;
            grid_start_x += path.length * Math.floor(i / path.length);
            const path_index = Math.abs(i % path.length);
            //find all z values where path exists in row
            const row = path[path_index];
            for (let z = 0; z < row.length; z++) {
                if (PathValueisPath(row[z])) {
                    const e = new Enemy(enemy_model_type, world_start_x, PathPosToWorldPos(z), grid_start_x);
                    global_enemy_ranges[enemy_model_type] += 1;
                    const wp = GetAllWayPoints(path_index, z);
                    if (wp.length === 0) {
                        throw "bad path pos";
                    }
                    e.addWayPoints(wp);
                    global_enemies.push(e);
                    enemies_added++;
                }
            }
        }

        for (let i = 0; i < global_enemies.length; i++) {
            const e = global_enemies[i];
            if (e.position.x >= tile_center.x - tile_dimensions / 2 - 0.5) {
                global_enemies.splice(0, i - 1);
                break;
            }
        }
        console.log(enemies_added, global_enemies.length);
    }

    last_tile_dimensions = tile_dimensions;
    last_tile_center = tile_center;

    useFrame((state, delta) => {
        delta = Math.min(delta, 5 / 60);
        for (let i = 0; i < global_enemies.length; i++) {
            const e = global_enemies[i];
            e.update(delta);
            e.speed = enemy_speed;
            if (e.marked_for_delete) {
                global_enemy_ranges[e.enemy_type] -= 1;
                global_enemies.splice(i, 1);
                e.visible = false;
            }
        }
    });

    return <EnemyInstances enemies={global_enemies} ranges={global_enemy_ranges} />;
}
