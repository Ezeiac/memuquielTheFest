import React, { useEffect, useState } from 'react'
import mundoPassport from '../assets/images/mundoPassport.png';
import '../styles/welcome.css'


export const Portada = () => {

    const [recorrido, setRecorrido] = useState(0)
    const [desaparecer, setdesaparecer] = useState('')

    const verUso = (input) => {
        setRecorrido(input.target.value);
      };

      useEffect(() => {
        if(Number(recorrido) >= 95){ 
        setTimeout(() => {
            setdesaparecer('d-none')
        }, 1500);
    }
      }, [recorrido])
      

      

    return (
        <div className={`portada ${Number(recorrido) >= 95 && 'pasarPagina'} ${desaparecer}`}>
            <div className='d-flex flex-column justify-content-around align-items-center text-center'>
                <h1>Pasaporte</h1>
                <img src={mundoPassport} width='240' alt="Mundo Passport" />
                <div>
                    <p>¡Bienvenidos al viaje de nuestras vidas!</p>
                    <div className='position-relative'>
                    <input className="mt-4" type="range" name="" id="" min="0" max="100" value={recorrido} onChange={verUso}/>
                    </div>
                </div>
            </div>
        </div>
    )
}


// onTouchStart={e => setPasarPagina('pasarPagina')} onClick={e => setPasarPagina('pasarPagina')}