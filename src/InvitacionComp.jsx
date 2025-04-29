import React, { useState } from 'react';
import  supabase  from '../src/supabaseClient'; // Asegúrate de usar la importación con llaves

export const InvitacionComp = ({ telOk, formOk, listaInv, telInv }) => {
    const invitado = listaInv.find(user => user.tel === telInv);
    const nGrupo = invitado?.grupo;
    const grupoFlia = nGrupo ? listaInv.filter(user => user.grupo === nGrupo) : [];

    const [checkedItems, setCheckedItems] = useState(() => {
        const initialChecked = {};
        grupoFlia.forEach(user => {
            initialChecked[user.tel] = true;
        });
        return initialChecked;
    });

    const changeStatus = (tel) => {
        setCheckedItems(prev => ({
            ...prev,
            [tel]: !prev[tel]
        }));
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
        <div className={formOk}>
            <div>Hola {telOk ? telOk.nombre : 'querido invitado'}</div>

            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Confirmar asistencia
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Confirmación</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ul>
                                {grupoFlia.map(nombres => (
                                    <li key={nombres.tel}>
                                        {nombres.nombre}
                                        <input
                                            className="m-2"
                                            type="checkbox"
                                            name="myCheckbox"
                                            checked={checkedItems[nombres.tel] || false}
                                            onChange={() => changeStatus(nombres.tel)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="p-2 bg-green-500 text-white rounded"
                                onClick={handleConfirm}
                            >
                                Confirmar asistencia
                            </button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
