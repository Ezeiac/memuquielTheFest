import React, { useRef, useEffect, useState } from 'react';
import '../styles/scratch.css'
import confirmDate from '../assets/icons/confirmDate.png'
import pulsa from '../assets/icons/pulsa.png'

const ScratchSurface = ({ tipoInv }) => {
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const reflejoRef = useRef(null);
  const [hasScratched, setHasScratched] = useState(() => {
    return localStorage.getItem('scratch') === 'true';
  });

  useEffect(() => {
    if (!hasScratched) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.fillStyle = '#ccc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [hasScratched]);

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const percent = (transparentPixels / (pixels.length / 4)) * 100;
    if (percent > 95 && !scratched) {
      setScratched(true);
      setHasScratched(true);
      localStorage.setItem('scratch', 'true');
      console.log("¡Raspado completado!");
    }
  };

  const handleDraw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    checkScratchProgress();
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const preventScroll = (e) => e.preventDefault();

    if (canvas) {
      canvas.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('touchmove', preventScroll);
      }
    };
  }, []);

  useEffect(() => {
    const handleOrientation = (e) => {
      const x = e.gamma || 0;
      const y = e.beta || 0;

      const xPos = 50 + x * 1.5;
      const yPos = 50 + y * 1.5;

      if (reflejoRef.current) {
        reflejoRef.current.style.background = `radial-gradient(circle at ${xPos}% ${yPos}%, rgba(255,255,255,0.35), transparent 60%)`;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);


  return (
    <>
      {tipoInv.paga == "completo"
        ? <div className='container'>
          La tarjeta tiene un valor de $75.000 (considera que a partir del 8 de julio se actualizara por inflacion)<br />
          Los menores de 12 años solo deben confirmar asistencia para prepararles su menú.
          <br />
          Fecha limite de pago: 8 de octubre<br />
          Por favor, si eres vegetariano o tiene alguna alergia/intolerancia alimentacia, avísanos al momento de confirmar para que se adapté el menú<br />
          Datos de pago (cuenta, banco, cbu, alias nombre)
        </div>
        : <div className='golden'>
          <div
            ref={reflejoRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              transition: 'background-position 0.1s',
              zIndex: 0,
            }}
          />

          <div className='border-golden'>
            <div className='textInv'>
              {tipoInv.paga == 'mitad' ?
                <>
                  <p style={{ fontSize: '24px', textAlign: 'center' }}>
                    Que suerte tienes Golden ticket!</p>
                  <p>
                    Eso significa que solo debes confirmar asistencia hasta el día 8 de octubre
                  </p>
                </>
                :
                <>
                  <p style={{ fontSize: '24px', textAlign: 'center' }}>
                    Que suerte tienes Golden ticket!</p>
                  <p>Eso significa que solo debes confirmar asistencia hasta el día 8 de octubre.<br />
                    Con tu confirmacion tambien te guardamos una cama para que puedas darlo todo y volver a tu casa descansado.<br />
                    Lo mejor es que el desayuno esta incluido.
                  </p>
                </>
              }
              <div className='asistencia'>
                <button className='invitados' type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  <img src={confirmDate} width="30" />
                  <img className='pulsa' src={pulsa} width='24' />
                </button>
              </div>
            </div>
            {!hasScratched && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '8px',
                  zIndex: 99,
                }}
              >
                ¡Raspa para ver terminos y condiciones de tu tarjeta!
              </div>
            )}

            {!hasScratched && (
              <>
                <canvas
                  ref={canvasRef}
                  onMouseMove={(e) => e.buttons === 1 && handleDraw(e)}
                  onTouchMove={handleDraw}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </>
            )}
          </div>
        </div>
      }
    </>
  );
};

export default ScratchSurface;
