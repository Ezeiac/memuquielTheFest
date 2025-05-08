import React, { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three';
import postal from '../assets/images/frentePostal.png';
import girar from '../assets/images/360.png';
import RockSalt from '../assets/fonts/RockSalt.ttf';
import '../styles/tarjeta.css';
import { Canvas, } from '@react-three/fiber';
import * as THREE from 'three';

export const Postal = ({datosTarjeta}) => {
    const [textoTarjeta, setTextoTarjeta] = useState('');

    function ImagenSobreTarjeta() {
        const texture = useLoader(TextureLoader, postal);
        return (
            <mesh position={[0, 0.25, 0.01]}>
                <planeGeometry args={[3, 3]} />
                <meshBasicMaterial map={texture} transparent />
            </mesh>
        );
    }

    useEffect(() => {
        setTextoTarjeta(`${datosTarjeta.nickname},\nGracias por\nacompañaros en\nesta aventura! ❤️`);
    }, [datosTarjeta]);

    return (
        <>
            <div className='postalTD'>
                <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={1} />
                        <directionalLight position={[4, 1.5, 10]} />
                        <group>
                            <mesh>
                                <boxGeometry args={[3.5, 4, 0.01]} />
                                <meshBasicMaterial color="white" specular='0xAAAAAA' shininess />
                            </mesh>
                            <ImagenSobreTarjeta />

                            {/* Texto al dorso */}
                            <group position={[0, 0.3, -0.012]} rotation={[0, Math.PI, Math.PI / 6]}>
                                <Text
                                    font={RockSalt}
                                    fontSize={0.25}
                                    color="#222"
                                    anchorX="center"
                                    anchorY="middle"
                                    lineHeight='1.5'
                                >
                                    {textoTarjeta}
                                </Text>
                            </group>
                        </group>
                        <OrbitControls enablePan={false} enableZoom={false} />
                    </Canvas>
                </div>
                <img src={girar}/>
            </div>
        </>
    );
}
