import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient';


export const useFetch = () => {
    
    const [invitado, setinvitado] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('ConfirmacionInv')  // Nombre de la tabla
                .select('*');  // Seleccion de campos

            if (error) {
                setError(error);
                setLoading(false);
            } else {
                setinvitado(data);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return {
        invitado,
        loading,
        error
    }
}
