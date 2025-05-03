import React, { useEffect, useState } from 'react';
import mundoPassport from '../assets/images/mundoPassport.png';
import '../styles/welcome.css';
import { FormComp } from './FormComp';

export const Portada = ({
  estados
}) => {
  const [desaparecer, setDesaparecer] = useState('');

  const {
    inputText, setInputText,
    nombre, setNombre,
    formEnviado, setFormEnviado,
    invitadoValido, setInvitadoValido,
    esError, setEsError,
    invitado,
    recorrido, setRecorrido
  } = estados;

  useEffect(() => {
    if (recorrido >= 100 && formEnviado) {
      setTimeout(() => {
        setDesaparecer('d-none');
      }, 1300);
    }
  }, [recorrido]);

  return (
    <div className={`portada ${invitadoValido && 'pasarPagina'} ${desaparecer} position-absolute`} >
      <div className='container d-flex flex-column justify-content-around align-items-center text-center m-0'>
        <p className='h1'>Pasaporte</p>
        <img src={mundoPassport} width='240' alt="Mundo Passport" />
        <div>
          <p className='h2'>¡Acompañanos al viaje de nuestras vidas!</p>
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
