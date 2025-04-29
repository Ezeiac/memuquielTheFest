import React, { useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch';
import { InvitacionComp } from './InvitacionComp';


function UserList() {
  const { invitado, loading, error } = useFetch();

  const [esError, setEsEresEor] = useState('');
  const [invitadoValido, setInvitadoValido] = useState(null);
  const [inputText, setInputText] = useState('');
  const [formEnviado, setFormEnviado] = useState(false);
  const [hideElement, setHideElement] = useState('');
  const [storageNumber, setStorageNumber] = useState(localStorage.getItem('telRegistrado'));

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tel = queryParams.get('tel');
    if (tel) {
      setInputText(tel);
      setStorageNumber(tel);
      localStorage.setItem('telRegistrado', tel);
      setFormEnviado(true);
    }
  }, []);

  useEffect(() => {
    if (storageNumber) {
      setInputText(storageNumber);
      setFormEnviado(true);
    }
  }, [storageNumber]);

  const inputChange = (input) => {
    setInputText(input.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const texto = 'es error';

    if (inputText.trim() === '') {
      setEsEresEor(texto);
      setInvitadoValido(null);
      return;
    }

    const encontrado = invitado.find(user => user.tel === inputText);
    if (encontrado) {
      setInvitadoValido(encontrado);
      setEsEresEor('');
      setFormEnviado(true);
    } else {
      setEsEresEor('');
      setInvitadoValido(null);
      setFormEnviado(true);
    }

    window.localStorage.setItem('telRegistrado', inputText);
  };

  useEffect(() => {
    setTimeout(() => {
      setHideElement('d-none');
    }, 2000);
  }, [formEnviado]);

  return (
    <>
      {!storageNumber ? (
        <form className={`${formEnviado ? `byebye ${hideElement}` : ''}`} onSubmit={handleSubmit}>
          <input
            type="tel"
            name="tel"
            id="tel"
            placeholder="Indique su celular"
            value={inputText}
            onChange={inputChange}
          />
          <button type="submit">Enviar</button>
        </form>
      ) : (
        <div></div>
      )}

      {error ? (
        <div>Error al cargar los datos: {error.message}</div>
      ) : loading ? (
        <div></div>
      ) : inputText !== '' && formEnviado ? (
        <InvitacionComp
          telOk={invitadoValido}
          formOk={formEnviado && 'aparecisteInv'}
          listaInv={invitado}
          telInv={inputText}
          numStorage={storageNumber}
        />
      ) : (
        esError
      )}
    </>
  );
}

export default UserList;
