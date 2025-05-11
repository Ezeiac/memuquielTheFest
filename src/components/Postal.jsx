import React, { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three';
import postal from '../assets/images/frentePostal.png';
import girar from '../assets/images/360.png';
import insta from '../assets/icons/instagram.png';
import RockSalt from '../assets/fonts/RockSalt.ttf';
import '../styles/tarjeta.css';
import { Canvas, } from '@react-three/fiber';

export const Postal = ({ datosTarjeta }) => {
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

    function ImagenInsta() {
        const texture = useLoader(TextureLoader, insta);
        return (
            <group onClick={() => window.open('https://www.instagram.com/memuquielfest?igsh=ZGpqbmFsbXV4YW5y')} rotation={[0, Math.PI, 0]}>
                <mesh position={[-1.4, -1.6, 0.012]}>
                    <planeGeometry args={[0.55, 0.5]} />
                    <meshBasicMaterial map={texture} transparent />
                </mesh>

                <Text position={[-1, -1.56, 0.015]}
                    font={RockSalt}
                    fontSize={0.15}
                    color="#222"
                    anchorX="start"
                    anchorY="middle"
                    lineHeight='1.5'
                >
                    {'Pulsa para seguirnos'}
                </Text>

                <Text position={[-1.45, -1.85, 0.015]}
                    font={RockSalt}
                    fontSize={0.1}
                    color="#222"
                    anchorX="start"
                    anchorY="middle"
                    lineHeight='1.5'
                >
                    {'Y no te olvides de etiquetarnos'}
                </Text>
            </group>
        );
    }

    useEffect(() => {
        setTextoTarjeta(`${datosTarjeta.nickname},\ngracias por\nacompañaros en\nesta aventura! ❤️`);
    }, [datosTarjeta]);

    const [desactivar, setDesactivar] = useState(() => {
        const giro = localStorage.getItem('giro');
        return giro === 'true';
    });

    useEffect(() => {
        window.localStorage.setItem('giro', desactivar)
    }, [desactivar])


    return (
        <>
            <div className='postalTD'>
                <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                    <Canvas className={desactivar ? 'doScroll' : undefined} camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={1} />
                        <directionalLight position={[4, 1.5, 10]} />
                        <group>
                            <mesh>
                                <boxGeometry args={[3.5, 4, 0.01]} />
                                <meshBasicMaterial color="white" specular='0xAAAAAA' shininess />
                            </mesh>
                            <ImagenSobreTarjeta />
                            <ImagenInsta />

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
                        <group position={[-0.45, -1.35, 0.012]}>
                            <Text
                                font={RockSalt}
                                fontSize={0.1}
                                color="#222"
                                anchorX="start"
                                anchorY="middle"
                                lineHeight='1.5'
                            >
                                {'Hecho con amor por Memuquiel'}
                            </Text>
                        </group>
                        <OrbitControls enablePan={false} enableZoom={false} />
                    </Canvas>
                </div>
                <div className={`touch ${!desactivar ? 'opacar' : undefined}`}>
                    <img src={girar} onClick={() => desactivar ? setDesactivar(false) : setDesactivar(true)} />
                </div>
            </div>
        </>
    );
}
