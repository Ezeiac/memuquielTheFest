import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import '../styles/InvitacionComp.css';
import { Background } from './Background';
import logo from '../assets/images/logo.png'
import pasaje from '../assets/images/pasajeAvion.png'
import final from '../assets/images/fin.png'
import cuenta from '../assets/images/cuenta.png'
import boardingPlane from '../assets/images/boardingPlane.png'
import verBarra from '../assets/images/verbarra.png'
import horBarra from '../assets/images/horbarra.png'

export const InvitacionComp = ({ telOk, nickname }) => {
    const [grupoFlia, setGrupoFlia] = useState([]);
    const [nGrupo, setNGrupo] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        const fetchGrupoYFamilia = async () => {
            if (!telOk) return;

            const { data: persona, error: errorPersona } = await supabase
                .from('ConfirmacionInv')
                .select('grupo')
                .eq('apellido', telOk.apellido)
                .eq('nombre', telOk.nombre)
                .single();

            if (errorPersona) {
                console.error('Error buscando grupo del invitado:', errorPersona.message);
                return;
            }

            setNGrupo(persona.grupo);

            const { data: grupoCompleto, error: errorGrupo } = await supabase
                .from('ConfirmacionInv')
                .select('*')
                .eq('grupo', persona.grupo);

            if (errorGrupo) {
                console.error('Error al obtener los datos del grupo:', errorGrupo.message);
            } else {
                setGrupoFlia(grupoCompleto);

                const initialChecked = {};
                grupoCompleto.forEach(persona => {
                    initialChecked[persona.tel] = persona.confirm;
                });
                setCheckedItems(initialChecked);
            }
        };

        fetchGrupoYFamilia();
    }, [telOk]);

    const updateConfirmacion = async (tel, confirm) => {
        const { error } = await supabase
            .from('ConfirmacionInv')
            .update({ confirm })
            .eq('tel', tel);

        if (error) {
            console.error(`Error al actualizar ${tel}:`, error.message);
        }
    };

    const changeStatus = (tel) => {
        setCheckedItems(prev => {
            const newValue = !prev[tel];
            updateConfirmacion(tel, newValue);
            return {
                ...prev,
                [tel]: newValue
            };
        });
    };

    const handleConfirm = async () => {
        for (const tel in checkedItems) {
            const confirm = checkedItems[tel];
            const { error } = await supabase
                .from('ConfirmacionInv')
                .update({ confirm })
                .eq('tel', tel);

            if (error) {
                console.error(`Error al actualizar ${tel}:`, error.message);
            }
        }
        alert('Confirmación enviada');
    };

    return (
        <>
            <Background />
            <div className='container'>
                <div className='position-relative text-center'>
                    <div className='primeraVista py-3'>
                        <svg width="400" height="200" viewBox="0 0 400 200">
                            <defs>
                                <path id="curva" d="M 50 150 Q 200 20, 350 150" fill="transparent" />
                            </defs>

                            <text fontSize="24" fill="black">
                                <textPath href="#curva" startOffset="50%" textAnchor="middle">
                                    Nos casamos!
                                </textPath>
                            </text>
                        </svg>

                        <img src={logo} width='200' />
                        <h1 className='my-4'>Melina y Ezequiel</h1>

                        <p className='h4 text-end align-self-end'>*Prepara tu equipaje <br />para acompañarnos</p>
                    </div>
                    {/* img avion y lineas curvas */}

                    {/* PASAJE DE AVION */}
                    <div className='billete completa'>
                        <img src={verBarra} width="64" />
                        <div className='membPasaje'>
                            <h2>Tarjeta de embarque</h2>
                            <span>Memuquiel Airlines</span>
                        </div>
                        <div>
                            <div><span>Pasajero</span><p>{telOk.apellido}, {telOk.nombre}</p></div>
                            <div><span>Hora de embarque</span><p>20:00hs</p></div>
                            <div><span>Origen</span><p>Córdoba</p></div>
                        </div>
                        <div className='align-content-end'>
                            <img src={boardingPlane} width="64" />
                        </div>
                        <div>
                            <div><span>Fecha</span><p>08 11 2025</p></div>
                            <div><span>Mesa</span><p>{telOk.mesa ? telOk.mesa : 'N/D'}</p></div>
                            <div><span>Destino</span><p>Río Ceballos</p></div>
                        </div>
                    </div>
                    <br />
                    <br />

                    <div className='billete'>
                        <div className='membPasaje'>
                            <div className='d-flex align-items-center justify-content-around'>
                                <div><p>Córdoba</p></div>
                                <img src={boardingPlane} width="64" />
                                <div><p>Río Ceballos</p></div>
                            </div>
                        </div>
                        <div>
                            <div><span>Pasajero</span><p>{telOk.apellido}, {telOk.nombre}</p></div>
                            <div><span>Fecha</span><p>08 11 2025</p></div>
                        </div>

                        <div>
                            <div><span>Hora de embarque</span><p>20:00hs</p></div>
                            <div><span>Mesa</span><p>{telOk.mesa ? telOk.mesa : 'N/D'}</p></div>
                        </div>
                        <img src={horBarra} height="64" />
                    </div>
                    {/* DESTINO */}
                    <p>Destino</p>
                    <p>Salón Villegas</p>
                    <p>Av. San Martín 3729, X5111 Río Ceballos, Córdoba, Argentina</p>
                    <p></p>

                    {/* ITINERARIO */}

                    {/* TARJETA */}

                    {/* SLIDER FOTOS */}

                    <img src={cuenta} width='200' />

                    {/* DRESSCODE */}

                    {/* ASISTENCIA BOTON FLOTANTE */}

                    {/* ALOJAMIENTO */}

                    {/* REGALO */}

                    {/* MUSICA */}

                    <img src={final} width='200' />


                    <div>Hola {nickname}</div>

                    <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Confirmar asistencia
                    </button>

                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="modal-title fs-5" id="exampleModalLabel">Confirmación de asistencia</h2>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <ul>
                                        {grupoFlia.length > 0 ? (
                                            grupoFlia
                                                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                                                .map(persona => (
                                                    <li
                                                        key={persona.tel}
                                                        onClick={() => changeStatus(persona.tel)}
                                                        onTouchStart={() => changeStatus(persona.tel)}
                                                    >
                                                        {persona.nombre} {persona.apellido}
                                                        <input
                                                            className="m-2"
                                                            type="checkbox"
                                                            name="myCheckbox"
                                                            checked={checkedItems[persona.tel] || false}
                                                            onChange={() => changeStatus(persona.tel)}
                                                        />
                                                    </li>
                                                ))
                                        ) : (
                                            <li>No hay personas en este grupo.</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="modal-footer">
                                    <button className="p-2 bg-green text-white rounded" onClick={handleConfirm}>
                                        Confirmar asistencia
                                    </button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
