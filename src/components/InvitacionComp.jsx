import React, { useState, useEffect, useRef } from 'react';
import { Background } from './Background';
import { useInView } from 'react-intersection-observer';
import { TarjetaComp } from './TarjetaComp';
import { Contador } from './Contador';
import supabase from '../supabaseClient';
import '../styles/InvitacionComp.css';
import logo from '../assets/images/logo.png'
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
import check from '../assets/icons/checkOk.gif'
import temazo from '../assets/icons/temazo.gif'
import { Postal } from './Postal';
import maleta from '../assets/icons/maleta.png';
import bailemos from '../assets/icons/baile.png';
import vestido from '../assets/icons/vestido.png';
import camisa from '../assets/icons/camisa.png';
import regalo from '../assets/icons/regalo.png';

export const InvitacionComp = ({ datosOk }) => {

    const [grupoFlia, setGrupoFlia] = useState([]);
    const [nGrupo, setNGrupo] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});
    const [duermeItems, setDuermeItems] = useState({});
    const consulta = datosOk;
    const [scrollRotation, setScrollRotation] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [confirmSuccess, setConfirmSuccess] = useState('Confirmar asistencia');

    const toggleDuerme = (id) => {
        setDuermeItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


    const { ref: finalPage, inView: viewFinalPage, entry: entryfinalPage } = useInView({
        threshold: 0.8,
    });

    const { ref: popUp, inView: viewPopUp, entry: entryPopUp } = useInView({
        threshold: 0.8,
    });

    const { ref: comienzaImg, inView: viewcomienzaImg, entry: entrycomienzaImg } = useInView({
        threshold: 0.5,
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
                const grupoOrdenado = [
                    ...grupoCompleto.filter(p => p.nombre === datosOk.nombre && p.apellido === datosOk.apellido),
                    ...grupoCompleto.filter(p => !(p.nombre === datosOk.nombre && p.apellido === datosOk.apellido)),
                ];

                setGrupoFlia(grupoOrdenado);

                const initialChecked = {};
                const initialDuerme = {};
                grupoOrdenado.forEach((persona) => {
                    initialChecked[persona.id] = persona.confirm === null ? true : persona.confirm;
                    if (persona.paga === "Alojamiento") {
                        initialDuerme[persona.id] = persona.duerme === null ? true : persona.duerme;
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
        for (const id in checkedItems) {
            const persona = grupoFlia.find(p => String(p.id) === id);
            const confirm = checkedItems[id];

            if (!persona) continue;

            const duerme = persona.paga === "Alojamiento" ? (duermeItems[id] || false) : false;

            const { error } = await supabase
                .from('ConfirmacionInv')
                .update({ confirm, duerme })
                .eq('id', id);

            if (error) {
                console.error(`Error al actualizar ${id}:`, error.message);
            }
        }

        setConfirmSuccess('Confirmación enviada');
        setShowModal(false);


        setTimeout(() => {
            setConfirmSuccess(false);
        }, 800);

        setTimeout(() => {
            setConfirmSuccess(true);
        }, 3000);

    };

    const handleButtonClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const selectBody = document.querySelector('body')

    useEffect(() => {
        showModal
            ? selectBody.classList.add('noScroll')
            : selectBody.classList.remove('noScroll')

    }, [showModal])


    const [vaDormir, setvaDormir] = useState(true)

    useEffect(() => {
        const conId = consulta && consulta.duerme
        setvaDormir(conId)
    }, [consulta])


    const cuantaImg = useRef()
    const imagenesRef = useRef([])
    const transformacionesAsignadas = useRef([])
    const estilosAsignados = useRef([])
    const initialized = useRef(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isDisabledfw, setIsDisabledfw] = useState(true)
    const [isDisabledbk, setIsDisabledbk] = useState(true)

    const obtenerImagenes = () => {
        if (!cuantaImg.current) return []
        return Array.from(cuantaImg.current.children).filter(
            (elemento) => elemento.tagName === 'IMG'
        )
    }

    const avanzarImagen = () => {
        const nuevoIndex = currentImageIndex + 1
        if (nuevoIndex < imagenesRef.current.length) {
            setCurrentImageIndex(nuevoIndex)
            const img = imagenesRef.current[nuevoIndex]
            const gradosDep = Math.floor(Math.random() * 31) - 15
            img.style.transform = `rotate(${gradosDep}deg) translate(-50%, -50%)`
            img.style.transition = 'transform 1.5s ease'
        }
    }

    const retrocederImagen = () => {
        if (currentImageIndex > 0) {
            const img = imagenesRef.current[currentImageIndex];
            const { grados, ancho, alto } = transformacionesAsignadas.current[currentImageIndex];
            img.style.transform = `rotate(${grados}deg) translate(${ancho}%, ${alto}px)`;
            img.style.transition = 'transform 1.5s ease';
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    useEffect(() => {
        const imagenes = obtenerImagenes()
        imagenesRef.current = imagenes

        estilosAsignados.current = imagenes.map(() => {
            const estilo = Math.floor(Math.random() * 4) + 1
            return `postal${estilo}`
        })

        transformacionesAsignadas.current = imagenes.map(() => {
            const alto = Math.floor(Math.random() * 41) - 20
            const grados = Math.floor(Math.random() * 41) - 20
            const ancho = [-1, 1][Math.floor(Math.random() * 2)] * 300
            return { grados, ancho, alto }
        })

        imagenes.forEach((img, i) => {
            const { grados, ancho, alto } = transformacionesAsignadas.current[i]
            img.style.transform = `rotate(${grados}deg) translate(${ancho}%, ${alto}px)`
            img.style.transition = 'transform 1.5s ease'
            img.classList.add(estilosAsignados.current[i])
        })
    }, [])

    useEffect(() => {
        if (viewcomienzaImg && !initialized.current) {
            initialized.current = true
            imagenesRef.current.forEach((img, index) => {
                const gradosDep = Math.floor(Math.random() * 21) - 10
                setTimeout(() => {
                    img.style.transform = `rotate(${gradosDep}deg) translate(-50%, -50%)`
                    img.style.transition = 'transform 1.5s ease'
                    if (index !== currentImageIndex) setCurrentImageIndex(index)
                }, index * 2000)
            })
        }
    }, [viewcomienzaImg])

    useEffect(() => {
        if (currentImageIndex + 1 === imagenesRef.current.length) {
            setTimeout(() => {
                setIsDisabledfw(false)
                setIsDisabledbk(false)
            }, 2000)
        }
    }, [currentImageIndex])

    const imagenes = [
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579141/1.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579141/IMG-20250127-WA0036_rfowjb.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579140/img8_sfncp8.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579140/img13_qig7s3.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579140/img4_oxowmc.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579140/img3_s2g6xs.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579140/img12_kp3prj.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/t_sintorta/v1746579139/img1_tvvqu1.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579139/img6_slp6tf.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579139/img10_ciqgbi.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579139/img11_qmz35c.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746725204/img7_kwuym3.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746579139/img5_vgjbns.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746725141/IMG-20250127-WA0028_cci0bm.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746725140/IMG-20250127-WA0032_uiugpb.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746725136/IMG-20250127-WA0018_tkefvw.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746725119/img3_riod1m.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746724986/Imagen_de_WhatsApp_2025-05-07_a_las_15.38.05_575285fc_pqvcir.jpg',
        'https://res.cloudinary.com/dlxpsuvvr/image/upload/v1746694954/1f64d4db_rjlijk.jpg'
    ];

    const [agregarTema, setAgregarTema] = useState('')
    const [temaAgregado, settemaAgregado] = useState(false)

    const guardarCancion = async (cancionData) => {
        if (!datosOk?.id) return;

        const { data, error: fetchError } = await supabase
            .from('ConfirmacionInv')
            .select('musica')
            .eq('id', datosOk.id)
            .single();

        if (fetchError) {
            console.error('Error obteniendo música previa:', fetchError.message);
            return;
        }

        const cancionesActuales = data?.musica || [];

        const nuevasCanciones = [...cancionesActuales, cancionData];

        const { error: updateError } = await supabase
            .from('ConfirmacionInv')
            .update({ musica: nuevasCanciones })
            .eq('id', datosOk.id);

        if (updateError) {
            console.error('Error al guardar canción:', updateError.message);
        } else {
            console.log('Canción guardada con éxito.');
        }
    };

    const handleCancion = async (e) => {
        e.preventDefault();

        if (!agregarTema.trim()) return;

        const temaData = {
            track: agregarTema.trim(),
            fecha: new Date().toISOString()
        };

        await guardarCancion(temaData);

        setTimeout(() => {
            setAgregarTema('');
        }, 1500);

        settemaAgregado(true)

        setTimeout(() => {
            settemaAgregado(false)

        }, 3000);
    };

    const ubicar = document.querySelector('.flotante');
    useEffect(() => {
        if (ubicar) {
            ubicar.classList.toggle('aparecer', !viewFinalPage);
        }
    }, [viewFinalPage]);

    const [flechaPrincipal, setFlechaPrincipal] = useState(true)
    const flechaOculta = useRef(false);

    useEffect(() => {
        const manejarScroll = () => {
            if (window.scrollY !== 0 && !flechaOculta.current) {
                setFlechaPrincipal(false);
                flechaOculta.current = true;
            }
        };

        window.addEventListener('scroll', manejarScroll);
        return () => window.removeEventListener('scroll', manejarScroll);
    }, []);


    const [animButton, setanimButton] = useState(false)
    const [copiadoM, setCopiadoM] = useState('Copiar alias')
    const [copiadoE, setCopiadoE] = useState('Copiar alias')

    // CUENTAS
    const aliasm1 = ''
    const aliasm2 = ''
    const aliasm3 = ''
    const aliase1 = ''
    const aliase2 = ''
    const aliase3 = ''
    const cuentaTransfM = aliasm1 + '.' + aliasm2 + aliasm3
    const cuentaTransfE = aliase1 + aliase2 + aliase3

    return (
        <>
            {/* VISTA INICIAL */}
            <section>
                <div className='primeraVista py-3'>
                    <Background />
                    <div className='container relative acomodarCont'>
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
                        <h1 className='py-4 text-center'>Melina y Ezequiel</h1>
                        <h2 className='h4 text-end align-self-end'><img className='me-1' src={maleta} width='40' />Prepará tu equipaje <br />para acompañarnos</h2>
                    </div>
                    <i className={`bi bi-chevron-double-down ${flechaPrincipal ? undefined : 'desvanecer'}`}></i>
                </div>
            </section>
            {/* PASAJE DE AVION */}
            <section className='my-5'>
                <div className="billete pb-2">
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
                        <span>Nº Mesa</span>
                        <p>{!isNaN(datosOk.mesa) && datosOk.mesa !== null ? datosOk.mesa : 'N/D'}</p>
                    </div>

                    <div className="viaje">
                        <span>Origen</span>
                        <p>Córdoba</p>
                    </div>
                    <img src={boardingPlane} width="64" className="avion" />
                    <div className="viaje">
                        <span>Destino</span>
                        <p>Río Ceballos</p>
                    </div>
                </div>
            </section>
            {/* DESTINO */}
            <section className='destino my-5'>
                <Background />
                <div className='container'>
                    <h1>Destino</h1>
                    <div className='direccion'>
                        <p className='h2'>Salón Villegas</p>
                        <p>San Martín 3729, Río Ceballos,
                            <br />Córdoba, Argentina</p>
                    </div>
                    <div onClick={(e) => e.currentTarget.querySelector('.pressTarjeta')?.classList.add('chauText')}>
                        <a
                            href='https://www.google.com.ar/maps/place/Av.+San+Mart%C3%ADn+3729,+X5111+R%C3%ADo+Ceballos,+C%C3%B3rdoba,+Argentina/@-31.1763868,-64.3148667,19z/data=!3m1!4b1!4m6!3m5!1s0x943281b6463fa893:0xa114e3732333c81c!8m2!3d-31.1763879!4d-64.314223!16s%2Fg%2F11kqtnv3yz?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D'
                            target="_blank"
                            rel="noopener noreferrer">
                            <img src={mapa} width='60' />
                        </a>
                        <div className='pressTarjeta'>
                            <img className='pulsa' src={pulsa} width='24' />
                            <p>Presiona el mapa<br />para abrir la ubicación</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* ITINERARIO */}
            <section className='my-5'>
                <h1 className='text-center'>Itinerario</h1>
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
            <section className='my-5'>
                <div ref={popUp}>
                    <TarjetaComp
                        datosTarjeta={consulta}
                        scrollRotation={scrollRotation}
                        cuentaTransfM={cuentaTransfM}
                    />
                </div>
            </section>
            {/* SLIDER FOTOS */}
            <section className='my-5'>
                <div ref={comienzaImg}>
                    <div className="acumulacionFotos" ref={cuantaImg}>
                        {imagenes.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                className={`mifoto ${initialized ? 'animacion' : ''} ${estilosAsignados.current[index] || ''}`}
                                alt={`Imagen ${index + 1}`}
                            />
                        ))}
                        <button className='left' onClick={retrocederImagen} disabled={isDisabledbk}><i className="bi bi-chevron-left"></i></button>
                        <button className='right' onClick={avanzarImagen} disabled={isDisabledfw}><i className="bi bi-chevron-right"></i></button>
                    </div>
                </div>
            </section>
            {/* RELOJ DESCUENTO */}
            <section className='my-5'>
                <h1 className='text-center'>Ya se viene la<br />Memuquiel Fest <img src={fiesta} width='40' /></h1>
                <Contador />
            </section>
            {/* MUSICA */}
            <section className='container my-5'>
                <h1 className='text-center'>Bailemos<br />de todo <img src={bailemos} width='40' /></h1>
                <p>Esta noche queremos que nos muestres tus pasos prohibidos, recomendanos tus canciones favoritas para que la fiesta sea aún mejor.</p>
                <form onSubmit={handleCancion} className='position-relative canciones'>
                    <input
                        className='px-2 canciones'
                        onChange={(e) => setAgregarTema(e.target.value)}
                        value={agregarTema}
                        placeholder='Indica nombre o link de tu canción'
                    />
                    <button type="submit" className='inputSend'>Enviar</button>
                    {temaAgregado && <img className='temazo' src={temazo} width='200' />}
                </form>
            </section>
            {/* VESTIMENTA */}
            <section className='container relative my-5'>
                <h1 className='text-center'>Vestimenta <img src={vestido} width='40' /><img src={camisa} width='40' /></h1>
                <p>Elegante sport, así que podés llevar lo que te haga sentir más cómodo. Shhh!! No digas nada, pero si necesitás algunas ideas, nosotros las sacamos de <a href='https://es.pinterest.com/search/pins/?q=invitados%20outfit%20casual&rs=typed' target='_blank'>acá</a>.</p>
            </section>
            {/* FONDO MEDIO */}
            <div className='backMiddle'><Background /></div>
            {/* REGALO */}
            <section className='container relative my-5'>
                <h1 className='text-center'>Regalos <img src={regalo} width='40' /></h1>
                <p>Ya nos diste el mejor regalo por venir a celebrar nuestro amor, pero si todavía te quedaron ganas y no sabés qué, te dejamos nuestras cuentas:</p>
                <div className='noMB'>
                    <p className='text-center fw-bold'>Memu</p>
                    <div className='d-flex flex-wrap justify-content-between mb-3'>
                        <p>Alias: {cuentaTransfM}</p>
                        <button className='copiar ms-3' onClick={() => navigator.clipboard.writeText(cuentaTransfM) && setCopiadoM(('Copiado ✅'))}>{copiadoM}</button>
                    </div>
                    <p className='text-center fw-bold'>Quiel</p>
                    <div className='d-flex flex-wrap justify-content-between mb-3'>
                        <p>Alias: {cuentaTransfE}</p>
                        <button className='copiar ms-3' onClick={() => navigator.clipboard.writeText(cuentaTransfE) && setCopiadoE(('Copiado ✅'))}>{copiadoE}</button>
                    </div>
                </div>
            </section>
            {/* FINAL */}
            <section className='final pb-4' ref={finalPage}>
                <Postal datosTarjeta={consulta} />
            </section>
            <div className={`flotante ${viewPopUp || (entryPopUp && entryPopUp.boundingClientRect.y < 0) ? 'aparecer' : ''}`}>
                <div className={`${animButton ? 'animacionButton' : ''}`} onClick={() => setanimButton(true)}>
                    <button className={`d-flex align-items-center asistir ${viewPopUp || (entryPopUp && entryPopUp.boundingClientRect.y < 0) ? '' : ''} ${!confirmSuccess ? 'enviadoBg' : ''}`} type="button" onClick={handleButtonClick}>
                        <p className='mb-0'>Confirmá tu asistencia aquí</p>
                        <img src={confirmSuccess ? confirm : check} width='35' alt="Confirmar" />
                    </button>
                </div>
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
                                    .map(persona => (
                                        <li key={persona.id}>
                                            <p className='nombreVa'>{persona.nickname.normalize()}</p>
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
                                                            <p className='mb-0 text-center'>Se queda a dormir?</p>
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
                            Si eres vegetariano o tienes alguna alergia/intolerancia, escribinos por whatsapp
                        </span>
                        <div>
                            <button className='platinum w-100' onClick={handleConfirm}>Confirmar asistencia</button>
                            {(vaDormir === false || (consulta.paga !== 'Alojamiento' && vaDormir === true)) &&
                                <button type="button" className="platinum w-100 mt-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Ver opciones de alojamiento
                                </button>
                            }
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
                                            <p>Más información <a href='https://sierraschicas.com/' target='_blank'>aquí</a></p>
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
