import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Routes, Route } from 'react-router-dom';
import { InvitacionComp } from './InvitacionComp';
import { Portada } from './Portada';
import '../styles/App.css';

function UserList() {
  const { invitado, loading, error } = useFetch();
  const nickname = localStorage.getItem('nickname');
  const [inputText, setInputText] = useState(localStorage.getItem('apellido') || '');
  const [nombre, setNombre] = useState(localStorage.getItem('nombre') || '');
  const [formEnviado, setFormEnviado] = useState(false);
  const [invitadoValido, setInvitadoValido] = useState(null);
  const [esError, setEsError] = useState('');
  const [recorrido, setRecorrido] = useState(0);

  const estadosCompartidos = {
    inputText, setInputText,
    nombre, setNombre,
    formEnviado, setFormEnviado,
    invitadoValido, setInvitadoValido,
    esError, setEsError,
    invitado,
    recorrido, setRecorrido
  };

  // Mostrar errores o loading
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
