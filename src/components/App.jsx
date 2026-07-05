import React, { useState, useMemo, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { InvitacionComp } from './InvitacionComp';
import { Portada } from './Portada';
import '../styles/App.css';

function UserList() {
  const [connect, setConnect] = useState(false)
  const { invitado, loading, error } = useFetch(connect);

  const [inputText, setInputText] = useState(localStorage.getItem('apellido') || '');
  const [nombre, setNombre] = useState(localStorage.getItem('nombre') || '');
  const [formEnviado, setFormEnviado] = useState(false);
  const [invitadoValido, setInvitadoValido] = useState(null);
  const [esError, setEsError] = useState('');
  const [recorrido, setRecorrido] = useState(0);
  const [demo, setDemo] = useState(0);

  useEffect(() => {
    if (connect) {
      setDemo(invitado)
    } else {
      setDemo([{
        id: 999,
        nombre: "demo",
        apellido: "demo",
        grupo: 999,
        confirm: true,
        mesa: 999,
        nickname: "demo",
        paga: 'Alojamiento',
        duerme: true,
        menu: "Adulto",
        habitacion: 999,
        wife: "María",
        husband: "Emilio",
        origen: "Origen",
        destino: "Destino",
        salon: "Salon Don Pepe",
        direccion: "Don Pepe x",
        direccion2: "Madrid, España",
        links: "#",
        festName: "Marilio",
        fecha: "01 01 2001"
      }])
      setInputText
      setNombre("demo")
      setInputText("demo")
    }
  }, [invitado, error])

  const estadosCompartidos = {
    inputText, setInputText,
    nombre, setNombre,
    formEnviado, setFormEnviado,
    invitadoValido, setInvitadoValido,
    esError, setEsError,
    invitado: demo,
    recorrido, setRecorrido,
    showSite: !!error
  };

  if (error) return <div>Error al cargar los datos: {error.message}</div>;
  if (loading) return <div className='bg-blue'>Cargando...</div>;

  return (
    <>
      <Portada estados={estadosCompartidos} />
      {invitadoValido && <InvitacionComp datosOk={invitadoValido} nickname={invitadoValido.nickname} nombre={nombre} />}

    </>
  );
}

export default UserList;