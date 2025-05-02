import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
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

  if (error) return <div>Error al cargar los datos: {error.message}</div>;
  if (loading) return <div className='bg-blue'>Cargando...</div>;

  return (
    <>

        <Portada
          inputText={inputText}
          setInputText={setInputText}
          nombre={nombre}
          setNombre={setNombre}
          formEnviado={formEnviado}
          setFormEnviado={setFormEnviado}
          invitadoValido={invitadoValido}
          setInvitadoValido={setInvitadoValido}
          esError={esError}
          setEsError={setEsError}
          invitado={invitado}
          recorrido={recorrido}
          setRecorrido={setRecorrido}
        />
        
        <InvitacionComp
          telOk={invitadoValido}
          formOk={formEnviado}
          listaInv={invitado}
          telInv={inputText}
          numStorage={inputText}
          nickname={nickname}
        />

    </>
  );
}

export default UserList;
