import React, { useEffect, useState } from 'react';
import mundoPassport from '../assets/images/mundoPassport.png';
import '../styles/welcome.css';
import { FormComp } from './FormComp';

export const Portada = ({
  inputText,
  setInputText,
  nombre,
  setNombre,
  formEnviado,
  setFormEnviado,
  invitadoValido,
  setInvitadoValido,
  esError,
  setEsError,
  invitado,
  recorrido,
  setRecorrido
}) => {
  const [desaparecer, setDesaparecer] = useState('');

  useEffect(() => {
    if (Number(recorrido) >= 100 && formEnviado) {
      setTimeout(() => {
        setDesaparecer('d-none');
      }, 1300);
    }
  }, [recorrido]);

  return (
    <div className={`portada ${invitadoValido && 'pasarPagina'} ${desaparecer}`} >
      <div className='d-flex flex-column justify-content-around align-items-center text-center'>
        <h1>Pasaporte</h1>
        <img src={mundoPassport} width='240' alt="Mundo Passport" />
        <div>
          <p>¡Bienvenidos al viaje de nuestras vidas!</p>
          <FormComp
            inputText={inputText}
            setInputText={setInputText}
            nombre={nombre}
            setNombre={setNombre}
            formEnviado={formEnviado}
            setFormEnviado={setFormEnviado}
            setInvitadoValido={setInvitadoValido}
            esError={esError}
            setEsError={setEsError}
            storageLN={localStorage.getItem('apellido')}
            invitado={invitado}
            recorrido={recorrido}
            setRecorrido={setRecorrido}
          />
        </div>
      </div>
    </div>
  );
};
