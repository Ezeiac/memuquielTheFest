import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import logo from '../assets/images/logoTarj.png'
import RobotoMono from '../assets/fonts/RobotoMono.ttf';

function ImagenSobreTarjeta() {
    const texture = useLoader(TextureLoader, logo);

    return (
        <mesh position={[0, 0, 0.041]}>
            <planeGeometry args={[3.2, 1.6]} />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
}

export function Tarjeta3D({ scrollRotation, textoTarjeta, frente, texture }) {
    const tarjetaRef = useRef();
    

    useFrame(() => {
        if (tarjetaRef.current) {
            tarjetaRef.current.rotation.y = -scrollRotation;
        }
    });

    return (
        <>
            <group ref={tarjetaRef}>
                <RoundedBox args={[3.5, 2.2, 0.01]} radius={0.02} smoothness={4}>
                    <meshStandardMaterial color="black" metalness={0.9} roughness={0.3} />
                </RoundedBox>

                <Text
                    position={[-1.5, 0.7, 0.045]}
                    font={RobotoMono}
                    fontSize={0.4}
                    color="#E5E4E2"
                    anchorX="start"
                    anchorY="middle"
                >
                    {'Acceso VIP'}
                </Text>
                <mesh position={[-0, 0.35, 0.045]}>
                    <planeGeometry args={[3.5, 0.02]} />
                    <meshBasicMaterial color="#E5E4E2" />
                </mesh>
                <Text
                    position={[-1.5, -0.30, 0.045]}
                    font={RobotoMono}
                    fontSize={0.2}
                    color="#E5E4E2"
                    anchorX="start"
                    anchorY="middle"
                >
                    {'0901 2021 0811 2025 \n'}
                </Text>
                <Text
                    position={[-1.5, -0.6, 0.045]}
                    font={RobotoMono}
                    fontSize={0.17}
                    color="#E5E4E2"
                    anchorX="start"
                    anchorY="middle"
                >
                    {frente}
                </Text>
                <Text
                    position={[0, -0.85, 0.045]}
                    font={RobotoMono}
                    fontSize={0.08}
                    color="grey"
                    anchorX="start"
                    anchorY="middle"
                >
                    {'Fecha vencimiento'}
                </Text>
                <Text
                    position={[0.9, -0.85, 0.045]}
                    font={RobotoMono}
                    fontSize={0.1}
                    color="#E5E4E2"
                    anchorX="start"
                    anchorY="middle"
                >
                    {'12/25'}
                </Text>

                {/* Texto al dorso */}
                <Text
                    position={[1.5, 0, -0.041]}
                    font={RobotoMono}
                    fontSize={0.15}
                    color="#E5E4E2"
                    rotation={[0, Math.PI, 0]}
                    anchorX="start"
                    anchorY="middle"
                >
                    {textoTarjeta}
                </Text>
                <ImagenSobreTarjeta url={texture} />
            </group>


        </>
    );
}
