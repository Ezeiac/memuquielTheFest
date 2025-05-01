import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import '../styles/InvitacionComp.css';

export const InvitacionComp = ({ telOk, formOk, listaInv, telInv, numStorage }) => {
    const [grupoFlia, setGrupoFlia] = useState([]);
    const [nGrupo, setNGrupo] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});

    const nickname = localStorage.getItem('nickname'); // Obtener el nickname del localStorage

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
        <div className={`${formOk} ${numStorage ? 'noAnimation' : 'aparecisteInv'}`}>
            <div>Hola {nickname || 'querido invitado'}</div>

            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Confirmar asistencia
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Confirmación de asistencia</h1>
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
                            <button className="p-2 bg-green-500 text-white rounded" onClick={handleConfirm}>
                                Confirmar asistencia
                            </button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
