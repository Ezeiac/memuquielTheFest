import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { InvitacionComp } from './InvitacionComp';
import Fuse from 'fuse.js';
import { Portada } from './Portada';
import '../styles/App.css'

function UserList() {
  const { invitado, loading, error } = useFetch();

  const [esError, setEsError] = useState('');
  const [invitadoValido, setInvitadoValido] = useState(null);
  const [inputText, setInputText] = useState('');
  const [nombre, setNombre] = useState('');
  const [formEnviado, setFormEnviado] = useState(false);
  const [hideElement, setHideElement] = useState('');
  const [storageLN, setStorageLN] = useState(localStorage.getItem('apellido'));
  const [storageFN, setStorageFN] = useState(localStorage.getItem('nombre'));
  const [placeApellido, setPlaceApellido] = useState("Indique su apellido");
  const [placeNombre, setPlaceNombre] = useState("Indique su nombre");
  const [errorStyle, setErrorStyle] = useState("");

  const [sugerencias, setSugerencias] = useState([]);
  const [showSugerencias, setShowSugerencias] = useState(false);

  useEffect(() => {
    if (storageLN && storageFN) {
      setInputText(storageLN);
      setNombre(storageFN);
      setFormEnviado(true);
    }
  }, [storageLN, storageFN]);

  const inputChange = (input) => {
    setInputText(input.target.value);
  };

  const nombreChange = (input) => {
    setNombre(input.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (inputText.trim() === '' || nombre.trim() === '') {
      setPlaceNombre('Falta su nombre');
      setPlaceApellido('Falta su apellido');
      setErrorStyle('errorMsg');      
      setInvitadoValido(null);
      setShowSugerencias(false);
      return;
    }

    const apellidoExacto = invitado.filter(user =>
      user.apellido.toLowerCase() === inputText.toLowerCase()
    );

    if (apellidoExacto.length > 0) {
      setPlaceNombre('');
      setPlaceApellido('');
    }

    if (apellidoExacto.length === 0) {
      setEsError('Verifica el apellido.');
      setSugerencias([]);
      setInvitadoValido(null);
      setFormEnviado(false);
      setShowSugerencias(true);
      return;
    }

    const coincidenciaExacta = apellidoExacto.find(user =>
      user.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (coincidenciaExacta) {
      setInvitadoValido(coincidenciaExacta);
      setEsError('');
      setFormEnviado(true);
      setShowSugerencias(false);

      window.localStorage.setItem('apellido', inputText);
      window.localStorage.setItem('nombre', nombre);
      window.localStorage.setItem('nickname', coincidenciaExacta.nickname);

      return;
    }

    const fuse = new Fuse(apellidoExacto, {
      keys: ['nombre'],
      threshold: 0.4, // 0.0 = muy estricto, 1.0 = muy laxo
    });

    const resultados = fuse.search(nombre);

    if (resultados.length > 0) {
      const sugerenciasFuzzy = resultados.map(r => r.item);
      setSugerencias(sugerenciasFuzzy);
      setEsError('');
      setInvitadoValido(null);
      setFormEnviado(false);
      setShowSugerencias(true);
    } else {
      setSugerencias([]);
      setEsError('No se encontraron nombres similares.');
      setInvitadoValido(null);
      setFormEnviado(false);
      setShowSugerencias(false);
    }
  };


  useEffect(() => {
    setTimeout(() => {
      setHideElement('d-none');
    }, 2000);
  }, [formEnviado]);

  if (storageLN && storageFN) {
    return (
      <InvitacionComp
        telOk={{ apellido: storageLN, nombre: storageFN }}
        formOk={formEnviado}
        listaInv={invitado}
        telInv={storageLN}
        numStorage={storageLN}
      />
    );
  }

  return (
    <>
      <Portada />

      <div className='container pasaporte-pattern'>
        <form className={`${formEnviado ? `byebye ${hideElement}` : ''}`} onSubmit={handleSubmit}>
          <div className='d-flex justify-content-between'>
            <div>
              <span>Tipo / Type</span>
              <p>P</p>
            </div>
            <div>
              <span>Código de País / Country Code</span>
              <p>Arg</p>
            </div>
          </div>
          <div className='text-start'>
            <div className='d-flex justify-content-between'>
              <div>
                <div>
                  <span>Apellidos / Surname</span><br />
                  <input
                    type="text"
                    name="apellido"
                    id="apellido"
                    placeholder={placeApellido}
                    value={inputText}
                    onChange={inputChange}
                    className={errorStyle}
                  />
                </div>
                <div>
                  <span>Nombres / Given Names</span><br />
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder={placeNombre}
                    value={nombre}
                    onChange={nombreChange}
                    minLength="4"
                    className={errorStyle}
                  />
                </div>
              </div>
              <div>
              <div>
                <span>Nacionalidad / Nacionality</span>
                <p>ARGENTINA</p>
              </div>
              <button type="submit">Validar datos</button>
            </div>
            </div>
            <div>
              <span>Fecha de Nacimiento / Dato of birth</span>
              <p></p>
            </div>

            <div>
              <div>
                <span>Sexo / Sex</span>
                <p></p>
              </div>
              <div>
                <span>Lugar de Nacimiento / Place of birth</span>
                <p></p>
              </div>
            </div>

            <div>
              <span>Fecha de emisión / Date of Issue</span>
              <p></p>
            </div>
            <div>
              <span>Fecha de Vencimiento / Date of Expiry</span>
              <p></p>
            </div>
            <div>
              <span>Número / Number</span>
              <p></p>
            </div>
            <div>
              <span>DNI / Personal Number</span>
              <p></p>
            </div>
            <div>
              <span>Autoridad / Authority</span>
              <p>Los novios</p>
            </div>
            <div>
              <span>Firma / Signature</span>
              <p></p>
            </div>
            <div>
              <span>Huella / Finger</span>
              <p></p>
            </div>

            <div>
              <p>P&lt;ARG{storageLN}&lt;&lt;{storageFN}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
              <p>
                NUMEROPASAPORTE
                ARG</p>
            </div>

          </div>
        </form>

        {error ? (
          <div>Error al cargar los datos: {error.message}</div>
        ) : loading ? (
          <div>Cargando...</div>
        ) : inputText !== '' && nombre !== '' && formEnviado && invitadoValido ? (
          <InvitacionComp
            telOk={invitadoValido}
            formOk={formEnviado}
            listaInv={invitado}
            telInv={inputText}
            numStorage={storageLN}
          />
        ) : (
          esError && <div className='esError'>{esError}</div>
        )}

        {showSugerencias && sugerencias.length > 0 && (

          <div className="sugerencias">
            <h5>¿Quisiste decir?</h5>
            <ul>
              {sugerencias.map((user, index) => (
                <li
                  key={index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setNombre(user.nombre);
                    setInputText(user.apellido);
                    setShowSugerencias(false);
                    setEsError('');
                  }}
                >
                  {user.nombre} {user.apellido}
                </li>
              ))}
            </ul>
          </div>
          
        )}
      </div>
    </>
  );
}

export default UserList;
