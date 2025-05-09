import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import logo from '../assets/images/logoTarj.png';
import RobotoMono from '../assets/fonts/RobotoMono.ttf';
import '../styles/tarjeta.css';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';
import pulsa from '../assets/icons/pulsa.png'


function ImagenSobreTarjeta() {
  const texture = useLoader(TextureLoader, logo);
  return (
    <mesh position={[0.05, 0, 0.041]}>
      <planeGeometry args={[3.6, 1.8]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

export function TarjetaComp({ datosTarjeta, cuentaTransfM }) {
  const frente = `${datosTarjeta.nombre} ${datosTarjeta.apellido}`;
  const [textoTarjeta, setTextoTarjeta] = useState('');

  const [tarjetaSeccion, setTarjetaSeccion] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0);

  const [chauText, setChauText] = useState(false)

  const [noRota, setNoRota] = useState(true)

  const rotarManual = () => {
    if (scrollRotation) {
      setScrollRotation(0)
    }
    else {
      setScrollRotation(-3.14159)
    }
    setChauText(true)
  }

  const { ref: verAsistenciaRef, inView: isAsistenciaVisible, entry } = useInView({
    threshold: 0.9,
  });

  useEffect(() => {
    const texto = (e) => {
      if (e.paga === 'MediaTarjeta') {
        return `La tarjeta tiene un valor de\n$75.000 (actualizable por inflación\ndesde el 8 de julio).\nMenores de 12 años solo deben\nconfirmar asistencia para\nprepararles su menú.\nAl confirmar tu asistencia,\nencontrarás información sobre\nalojamientos cercanos.`;
      } else if (e.paga === 'SoloFiesta') {
        return 'Solo debes confirmar asistencia\nhasta el día 8 de octubre.\nDentro de "Confirmar Asistencia",\nencontrarás información sobre\nalojamientos cercanos.';
      } else if (e.paga === 'Alojamiento') {
        return 'Solo debes confirmar asistencia\nhasta el día 8 de octubre.\nCuentas con noche de alojamiento\ny desayuno incluidos.';
      }
    };
    setTextoTarjeta(texto(datosTarjeta));
  }, [datosTarjeta]);


  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }} ref={verAsistenciaRef}>
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[4, 1.5, 10]} />
        <Tarjeta3D
          scrollRotation={scrollRotation}
          textoTarjeta={textoTarjeta}
          frente={frente}
          datosTarjeta={datosTarjeta}
          rotarManual={rotarManual}
          cuentaTransfM={cuentaTransfM}
        />
      </Canvas>
      <div className={`pressTarjeta ${chauText ? 'chauText' : ''}`}><img className='pulsaTarj' src={pulsa} width='24' /><p>Presiona para voltear</p></div>
    </div>
  );
}

function Tarjeta3D({ scrollRotation, textoTarjeta, frente, rotarManual, cuentaTransfM, datosTarjeta }) {
  const meshRef = useRef();

  const [copiado, setCopiado] = useState('Copiar alias')
  const nCuenta = cuentaTransfM
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        scrollRotation,
        0.05
      );
    }
  });

  const [ubiTexto, setUbiTexto] = useState(0)

  useEffect(() => {
    if (datosTarjeta.paga == 'MediaTarjeta') {
      setUbiTexto(0.2)
    } else {
      setUbiTexto(-0.2)
    }

  }, [])

  return (
    <group ref={meshRef}>
      {/* Tarjeta con rotación */}
      <group onClick={rotarManual}>
        <RoundedBox args={[3.8, 2.5, 0.01]} radius={0.02} smoothness={4}>
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

        <mesh position={[-0, 0.35, -0.045]}>
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
        {datosTarjeta.paga != 'MediaTarjeta' &&
          <Text
            position={[1.5, 0.6, -0.045]}
            font={RobotoMono}
            fontSize={0.3}
            color="#E5E4E2"
            rotation={[0, Math.PI, 0]}
            anchorX="start"
            anchorY="middle"
          >
            {'Premium Pass'}
          </Text>
        }
        <Text
          position={[1.5, ubiTexto, -0.045]}
          font={RobotoMono}
          fontSize={0.15}
          color="#E5E4E2"
          rotation={[0, Math.PI, 0]}
          anchorX="start"
          anchorY="middle"
        >
          {textoTarjeta}
        </Text>

        {datosTarjeta.paga == 'MediaTarjeta' &&
          <Text
            position={[1.5, -0.8, -0.045]}
            font={RobotoMono}
            fontSize={0.15}
            color="#E5E4E2"
            rotation={[0, Math.PI, 0]}
            anchorX="start"
            anchorY="middle"
          >
            {`Alias: ${cuentaTransfM}`}
          </Text>}
        {datosTarjeta.paga == 'MediaTarjeta' &&

          <mesh position={[0.9, -1.05, -0.05]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.2, 0.2]} />
            <meshBasicMaterial color="#BEBEBE" />
          </mesh>
        }
      </group>

      {datosTarjeta.paga == 'MediaTarjeta' &&
        <Text
          position={[1.45, -1.05, -0.055]}
          font={RobotoMono}
          fontSize={0.15}
          color='black'
          rotation={[0, Math.PI, 0]}
          anchorX="start"
          anchorY="middle"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(nCuenta);
            setCopiado('Copiado ✅');
          }}
        >
          {copiado}
        </Text>
      }

      <ImagenSobreTarjeta />
    </group>

  );
}
