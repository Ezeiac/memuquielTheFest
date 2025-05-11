import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  const [placeApellido, setPlaceApellido] = useState("Apellido / Surname");
  const [placeNombre, setPlaceNombre] = useState("Nombre / Name");
  const [errorStyle, setErrorStyle] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [tipoSugerencia, setTipoSugerencia] = useState('');
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(0);
  const storageFN = localStorage.getItem('nombre');

  const posicionLeft = useMemo(() => {
    return ((inputWidth * recorrido) / 100) + 70 * (1 - recorrido / 100);
  }, [inputWidth, recorrido]);

  const normalizarTexto = (texto) => {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim();
};


const handleSubmit = useCallback((event = null) => {
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
      }, 400);
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
      normalizarTexto(user.apellido) === normalizarTexto(inputText)
    );

    const coincidenciaExacta = apellidoExacto.find(user =>
      normalizarTexto(user.nombre) === normalizarTexto(nombre)
    );

    if (coincidenciaExacta) {
      window.localStorage.setItem('nickname', coincidenciaExacta.nickname);
      setInvitadoValido(coincidenciaExacta);
      setEsError('');
      setFormEnviado(true);
      setShowSugerencias(false);
      window.localStorage.setItem('apellido', inputText);
      window.localStorage.setItem('nombre', nombre);
      window.localStorage.setItem('nickname', coincidenciaExacta.nickname);
      return;
    }

    const fuseNombre = new Fuse(apellidoExacto, {
      keys: ['nombre'],
      threshold: 0.4,
    });

    const resultados = fuseNombre.search(nombre);

    if (resultados.length > 0) {
      const sugerenciasNombres = resultados.map(r => r.item.nombre);
      const nombresUnicos = [...new Set(sugerenciasNombres)];
      setSugerencias(nombresUnicos);
      setTipoSugerencia('nombre');
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

    // Aquí estaba el error de falta de cierre
    const fuseApellido = new Fuse(invitado, {
      keys: ['apellido'],
      threshold: 0.4,
    });

    const resultadosApellido = fuseApellido.search(inputText);
    const apellidosUnicos = [...new Set(resultadosApellido.map(r => r.item.apellido))];

    if (apellidosUnicos.length > 0) {
      setSugerencias(apellidosUnicos);
      setTipoSugerencia('apellido');
      setInvitadoValido(null);
      setFormEnviado(false);
      setShowSugerencias(true);
    } else {
      setSugerencias([]);
      setEsError('No se encontraron apellidos similares.');
      setInvitadoValido(null);
      setFormEnviado(false);
      setShowSugerencias(false);
    }
}, [formEnviado, recorrido, inputText, nombre, invitado, setRecorrido, setInvitadoValido, setFormEnviado, setEsError, setSugerencias]);

  useEffect(() => {
    if (formEnviado) {
      setTimeout(() => {
        setHideElement('d-none');
      }, 2000);
    }
  }, [formEnviado]);

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [recorrido]);

  const verUso = (input) => {
    const valor = Number(input.target.value);
    setRecorrido(valor);

    if (valor >= 80) {
      handleSubmit();
    }
  };

  return (
    <div>
      <form className='pasaporte-pattern' onSubmit={handleSubmit}>
        <div className='text-start'>
          <div className='marginH d-flex justify-content-around'>
            {(storageLN && storageFN)
              ? <p>Hola de nuevo {window.localStorage.getItem('nickname')}</p>
              : <div>
                <div>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder={placeNombre}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value.trimStart())}
                    minLength="4"
                    className={errorStyle}
                    autoComplete='off'
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="apellido"
                    id="apellido"
                    placeholder={placeApellido}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value.trimStart())}
                    minLength="4"
                    className={errorStyle}
                    autoComplete='off'
                  />
                </div>
              </div>
            }
          </div>
          <div className='boxSlider'>
          <div className='slider-container'>
            <input
              type="range"
              min="0"
              max="100"
              value={recorrido}
              onChange={verUso}
              disabled={formEnviado}
              ref={inputRef}
            />
            {!formEnviado && (
              <div className="slider-placeholder animate-fade" style={
                recorrido <= 100
                  ? { left: `${posicionLeft}px` }
                  : { display: 'none'}
              }
              >
                <i className="bi bi-chevron-double-right"></i>
              </div>
            )}
          </div>
          </div>
          {esError && <div className="esError">{esError}</div>}
        </div>
      </form>

      {showSugerencias && sugerencias.length > 0 && (
        <div className="container modal1" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div className="sugerencias">
                  <div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowSugerencias(false)}>
                    </button>
                    <h5 className='mb-2'>Quisiste decir:</h5>
                    <ul>
                      {sugerencias.map((item, index) => (
                        <li
                          key={index}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            if (tipoSugerencia === 'apellido') {
                              setInputText(item);
                            } else if (tipoSugerencia === 'nombre') {
                              setNombre(item);
                            }
                            setShowSugerencias(false);
                            setEsError('');
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
