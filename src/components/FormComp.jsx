import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export const FormComp = ({
  inputText,
  setInputText,
  nombre,
  setNombre,
  formEnviado,
  setFormEnviado,
  setInvitadoValido,
  esError,
  setEsError,
  storageLN,
  invitado,
  recorrido,
  setRecorrido
}) => {
  const [hideElement, setHideElement] = useState('');
  const [placeApellido, setPlaceApellido] = useState("Indique su apellido");
  const [placeNombre, setPlaceNombre] = useState("Indique su nombre");
  const [errorStyle, setErrorStyle] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const storageFN = localStorage.getItem('nombre');


  const handleSubmit = (event = null) => {
    if (event) event.preventDefault();

    if (!formEnviado && recorrido > 0) {
      setTimeout(() => {
        let valorAnterior = recorrido;
        const animarRetroceso = () => {
          valorAnterior -= 1;
          if (valorAnterior < 0) {
            setRecorrido(0);
            return;
          }
          setRecorrido(valorAnterior);
          requestAnimationFrame(animarRetroceso);
        };
        requestAnimationFrame(animarRetroceso);
      }, 1000);
    }

    if (!inputText || !nombre || inputText.trim() === '' || nombre.trim() === '') {
      setPlaceNombre('Complete con su nombre');
      setPlaceApellido('Complete con su apellido');
      setErrorStyle('errorMsg');
      setInvitadoValido(null);
      setShowSugerencias(false);
      return;
    }

    const apellidoExacto = invitado.filter(user =>
      user.apellido.toLowerCase() === inputText.toLowerCase()
    );

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
      threshold: 0.4,
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

  const verUso = (input) => {
    const valor = Number(input.target.value);
    setRecorrido(valor);

    if (valor >= 100) {
      handleSubmit();
    }
  };

  return (
    <div className='container'>
      <form className='pasaporte-pattern' onSubmit={handleSubmit}>
        <div className='text-start'>
          <div className='d-flex justify-content-around'>
            {(storageLN && storageFN)
              ? <p>Bievenido {window.localStorage.getItem('nickname')}</p>

              : <div className='d-lg-flex'>
                <div>
                  <span>Nombre / Name</span><br />
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder={placeNombre}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    minLength="4"
                    className={errorStyle}
                  />
                </div>
                <div>
                  <span>Apellido / Surname</span><br />
                  <input
                    type="text"
                    name="apellido"
                    id="apellido"
                    placeholder={placeApellido}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className={errorStyle}
                  />
                </div>

              </div>
            }
          </div>
          <div className='position-relative text-center'>
            <input
              type="range"
              min="0"
              max="100"
              value={recorrido}
              onChange={verUso}
              disabled={formEnviado}
            />
          </div>
          {esError && <div className="esError">{esError}</div>}
        </div>
      </form>

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
  );
};
