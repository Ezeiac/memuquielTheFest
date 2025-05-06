import React, { useState, useEffect, useRef } from 'react';
import { Background } from './Background';
import { useInView } from 'react-intersection-observer';
import { TarjetaComp } from './TarjetaComp';
import supabase from '../supabaseClient';
import '../styles/InvitacionComp.css';
import logo from '../assets/images/logo.png'
import final from '../assets/images/fin.png'
import cuenta from '../assets/images/cuenta.png'
import boardingPlane from '../assets/images/boardingPlane.png'
import verBarra from '../assets/images/verbarra.png'
import mapa from '../assets/icons/mapa.png'
import pulsa from '../assets/icons/pulsa.png'
import avionInt from '../assets/icons/avionInt1.png'
import anillos from '../assets/icons/anillosunfill.png'
import recepcion from '../assets/icons/recepcion.png'
import fiesta from '../assets/icons/fiesta.png'
import cena from '../assets/icons/cena.png'
import confirm from '../assets/icons/confirmDate.png'
import { useFrame, Canvas } from '@react-three/fiber';

export const InvitacionComp = ({ datosOk }) => {
    const [grupoFlia, setGrupoFlia] = useState([]);
    const [nGrupo, setNGrupo] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});
    const [duermeItems, setDuermeItems] = useState({});
    const consulta = datosOk;
    const [scrollRotation, setScrollRotation] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [confirmStyle, setConfirmStyle] = useState('platinum');
    const [confirmSuccess, setConfirmSuccess] = useState('Confirmar asistencia');
    const [tarjetaSeccion, setTarjetaSeccion] = useState(false);


    const toggleDuerme = (id) => {
        setDuermeItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


    const { ref: popUp, inView: viewPopUp, entry } = useInView({

    });

    const { ref: itinerarioRef, inView: itinerarioVisible } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    useEffect(() => {
        const fetchGrupoYFamilia = async () => {
            if (!datosOk) return;

            const { data: persona, error: errorPersona } = await supabase
                .from('ConfirmacionInv')
                .select('grupo')
                .eq('apellido', datosOk.apellido)
                .eq('nombre', datosOk.nombre)
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
                const initialDuerme = {};
                grupoCompleto.forEach((persona) => {
                    initialChecked[persona.id] = persona.confirm;
                    if (persona.paga === "Alojamiento") {
                        initialDuerme[persona.id] = persona.duerme || false;
                    }
                });
                setCheckedItems(initialChecked);
                setDuermeItems(initialDuerme);
            }
        };

        fetchGrupoYFamilia();
    }, [datosOk]);

    const updateConfirmacion = async (id, confirm) => {
        const { error } = await supabase
            .from('ConfirmacionInv')
            .update({ confirm })
            .eq('id', id);

        if (error) {
            console.error(`Error al actualizar ${id}:`, error.message);
        }
    };

    const changeStatus = (id) => {
        setCheckedItems(prev => {
            const newValue = !prev[id];
            updateConfirmacion(id, newValue);
            return { ...prev, [id]: newValue };
        });
    };

    const handleConfirm = async () => {
        console.log("checkedItems:", checkedItems);
        for (const id in checkedItems) {
            const persona = grupoFlia.find(p => String(p.id) === id);
            const confirm = checkedItems[id];

            if (!persona) continue;

            const duerme = persona.paga === "Alojamiento" ? (duermeItems[id] || false) : null;

            const { error } = await supabase
                .from('ConfirmacionInv')
                .update({ confirm, duerme })
                .eq('id', id);

            if (error) {
                console.error(`Error al actualizar ${id}:`, error.message);
            }
            console.log(`Enviando para ${persona.nombre}: confirm=${confirm}, duerme=${duerme}`);
        }

        setConfirmSuccess('Confirmación enviada');
        setConfirmStyle('green');

        setTimeout(() => {
            setShowModal(false);
        }, 1000);

        setTimeout(() => {
            setConfirmSuccess('Confirmar asistencia');
            setConfirmStyle('platinum');
        }, 2000);
    };

    const handleButtonClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <section>
                <div className='primeraVista py-3'>
                    <Background />
                    <div className='container acomodarCont'>
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
                        <h1 className='py-4'>Melina y Ezequiel</h1>
                        <h2 className='h4 text-end align-self-end'>*Prepara tu equipaje <br />para acompañarnos</h2>
                    </div>
                </div>
            </section>
            {/* PASAJE DE AVION */}
            <section>
                <div className="billete">
                    <img src={verBarra} width="64" className="barra" />
                    <div className="membPasaje">
                        <h2>Tarjeta de embarque</h2>
                        <span>Memuquiel Airlines</span>
                    </div>
                    <div className="dato">
                        <span>Pasajero</span>
                        <p>{datosOk.apellido}, {datosOk.nombre}</p>
                    </div>
                    <div className="dato">
                        <span>Fecha</span>
                        <p>08 11 2025</p>
                    </div>
                    <div className="dato">
                        <span>Hora de embarque</span>
                        <p>19:00hs</p>
                    </div>
                    <div className="dato">
                        <span>Mesa</span>
                        <p>{datosOk.mesa ? datosOk.mesa : 'N/D'}</p>
                    </div>
                    <div className="viaje">
                        <div>
                            <span>Origen</span>
                            <p>Córdoba</p>
                        </div>
                        <img src={boardingPlane} width="64" className="avion" />
                        <div>
                            <span>Destino</span>
                            <p>Río Ceballos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DESTINO */}
            <section className='destino'>
                <Background />
                <div>
                    <h2 className='h1'>Destino</h2>
                    <div className='direccion'>
                        <p className='h2'>Salón Villegas</p>
                        <p>San Martín 3729, Río Ceballos,
                            <br />Córdoba, Argentina</p>
                    </div>
                    <a
                        href='https://www.google.com.ar/maps/place/Av.+San+Mart%C3%ADn+3729,+X5111+R%C3%ADo+Ceballos,+C%C3%B3rdoba,+Argentina/@-31.1763868,-64.3148667,19z/data=!3m1!4b1!4m6!3m5!1s0x943281b6463fa893:0xa114e3732333c81c!8m2!3d-31.1763879!4d-64.314223!16s%2Fg%2F11kqtnv3yz?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D'
                        target="_blank"
                        rel="noopener noreferrer">
                        <img src={mapa} width='60' />
                        <img className='pulsa' src={pulsa} width='24' />
                    </a>
                </div>
            </section>
            {/* ITINERARIO */}
            <section className='my-4'>
                <h2 className='h1 text-center'>Itinerario</h2>
                <div className='itinerario' ref={itinerarioRef}>
                    {itinerarioVisible && (
                        <>
                            <svg viewBox="0 0 560 150" preserveAspectRatio="xMidYMid meet">
                                <path
                                    id="miCamino"
                                    d="M0 90 Q 140 0, 280 90 T 560 90"
                                    fill="transparent"
                                    stroke="#F6E3BA"
                                    strokeWidth="2"
                                    strokeDasharray="596"
                                    strokeDashoffset="596">
                                    <animate
                                        attributeName="stroke-dashoffset"
                                        from="596"
                                        to="0"
                                        dur="5s"
                                        fill="freeze" />
                                </path>

                                <image href={avionInt} width="34" height="34" x="-17" y="-17">
                                    <animateMotion
                                        dur="5s"
                                        repeatCount="1"
                                        rotate="auto">
                                        <mpath href="#miCamino" />
                                    </animateMotion>
                                </image>
                            </svg>
                            <div className='ceremonia'><p>Ceremonia</p><img src={anillos} width='25' /><span>19.00hs</span></div>
                            <div className='recepcion'><p>Recepción</p><img src={recepcion} width='25' /><span>19.30hs</span></div>
                            <div className='cena'><p>Cena</p><img src={cena} width='25' /><span>20.30hs</span></div>
                            <div className='fiesta'><p>Fiesta</p><img src={fiesta} width='25' /><span>23.00hs</span></div>
                        </>
                    )}
                </div>
            </section>
            {/* TARJETA */}

            <section>
                <div>
                    <TarjetaComp
                        datosTarjeta={consulta}
                        scrollRotation={scrollRotation}
                    />
                </div>
            </section>
            {/* SLIDER FOTOS */}
            <section ref={popUp}>
                <div id="carouselExampleInterval" className="carousel slide mt-5" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active" data-bs-interval="10000">
                            <img src={final} className="d-block w-100" alt="Primera imagen" />
                        </div>
                        <div className="carousel-item" data-bs-interval="2000">
                            <img src={final} className="d-block w-100" alt="Segunda imagen" />
                        </div>
                        <div className="carousel-item">
                            <img src={final} className="d-block w-100" alt="Tercera imagen" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>
            <img src={cuenta} width='200' />

            {/* DRESSCODE */}

            {/* REGALO */}

            {/* MUSICA */}

            <img src={final} width='200' />

            <div className={`flotante ${viewPopUp || (entry && entry.boundingClientRect.y < 0) ? 'aparecer' : ''}`}>
                <button className={`asistir ${viewPopUp || (entry && entry.boundingClientRect.y < 0) ? 'gelatina' : ''}`} type="button" onClick={handleButtonClick}>
                    <img src={confirm} width='35' alt="Confirmar" />
                </button>
            </div>

            <div className={`custom-modal-backdrop ${showModal ? 'mostrar' : 'ocultar'}`} onClick={handleCloseModal}>
                <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="custom-modal-header">
                        <h2 className='mb-0'>Confirmación de asistencia</h2>
                        <button className="custom-btn-close" onClick={handleCloseModal}><i className="bi bi-chevron-down"></i></button>
                    </div>
                    <div className="custom-modal-body">
                        <ul>
                            {grupoFlia.length > 0 ? (
                                grupoFlia
                                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
                                    .map(persona => (
                                        <li key={persona.id}>
                                            <p className='mb-0 text-center'>{persona.nombre}</p>
                                            <div className='justify-content-around'>
                                                <div className='text-center'>
                                                    <p className='mb-0 text-center'>Asiste?</p>
                                                    <label className="switch-container">
                                                        <input
                                                            className="m-2"
                                                            type="checkbox"
                                                            checked={checkedItems[persona.id] || false}
                                                            onChange={() => changeStatus(persona.id)}
                                                        />
                                                        <span className="sliderCheck festejar" />
                                                    </label>
                                                </div>
                                                {persona.paga === "Alojamiento" && (
                                                    <div className='d-flex flex-column align-items-center'>
                                                        <div className='text-center'>
                                                            <p className='mb-0 text-center'>¿Se queda a dormir?</p>
                                                            <label className="switch-container">
                                                                <input
                                                                    className="m-2"
                                                                    type="checkbox"
                                                                    checked={duermeItems[persona.id] || false}
                                                                    onChange={() => toggleDuerme(persona.id)}
                                                                />
                                                                <span className="sliderCheck dormir" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <hr />
                                        </li>
                                    ))
                            ) : (
                                <li>No hay personas en este grupo.</li>
                            )}
                        </ul>
                    </div>
                    <div className="custom-modal-footer">
                        <span>
                            Si eres vegetariano o tienes alguna alergia/intolerancia, avísanos al momento de confirmar
                        </span>
                        <div>
                            <button className={`${confirmStyle} w-100`} onClick={handleConfirm}>
                                {confirmSuccess}
                            </button>
                            {grupoFlia.duerme !== 'Alojamiento' &&
                                <button type="button" className="platinum w-100" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Ver opciones de alojamiento
                                </button>}

                            <div className="modal fade otroAlojamiento" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Les facilitamos la información brindada por el salón</h1>
                                        </div>
                                        <div className="modal-body">
                                            <div>
                                            <p>Hotel San Pedro</p>
                                            <div>
                                                <a href='tel:03543451305'><i className="bi bi-telephone-fill"></i></a>
                                                <a href="https://api.whatsapp.com/send/?phone=54353983292&text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%el%20hospedaje" target='_blank'><i className="bi bi-whatsapp"></i></a>
                                                <a href='https://maps.app.goo.gl/jPyf3xvi9GHaJZo18' target='_blank'><i className="bi bi-geo-alt-fill"></i></a>
                                            </div>
                                            </div>
                                            <div>
                                            <p>Hotel Namuncurá</p>
                                            <div>
                                                <a href='https://api.whatsapp.com/send/?phone=543543206060&text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%el%20hospedaje' target='_blank'><i className="bi bi-whatsapp"></i></a>
                                                <a href='https://maps.app.goo.gl/SpwZasZzUmbhjNWY7' target='_blank'><i className="bi bi-geo-alt-fill"></i></a>
                                            </div>
                                            </div>
                                            <div>
                                            <p>Hotel Asimra y California</p>
                                            <div>
                                                <a href='https://api.whatsapp.com/send/?phone=5493516301990&text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%el%20hospedaje'><i className="bi bi-whatsapp"></i></a>
                                                <a href='https://maps.app.goo.gl/1zPQxqtiQvZJNjMf6' target='_blank'><i className="bi bi-geo-alt-fill"></i></a>
                                            </div>
                                            </div>
                                            <div>
                                            <p>Hotel 27 de marzo</p>
                                            <div>
                                                <a href='https://maps.app.goo.gl/XjsCWZWuzQrRVioX8' target='_blank'><i className="bi bi-geo-alt-fill"></i></a>
                                            </div>
                                            </div>
                                            <div>
                                            <p>Cabaña La Matilde</p>
                                            <div>
                                                <a href='tel:03543452347'><i className="bi bi-telephone-fill"></i></a>
                                                <a href='https://maps.app.goo.gl/Mc37Pbffp73F2NW86' target='_blank'><i className="bi bi-geo-alt-fill"></i></a>
                                            </div>
                                            </div>
                                            <p>Más información <a href='https://sierraschicas.com/'>aquí</a></p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="platinum w-50" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
