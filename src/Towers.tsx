import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { ArrowTowerModel } from "./ArrowTowerModel";

export const Towers = (props: JSX.IntrinsicElements["group"]) => {
    return (
        <group>
            <ArrowTowerModel position={[0, 5, 0]} arrow_position={[0,1,0]} />
        </group>
    );
};
