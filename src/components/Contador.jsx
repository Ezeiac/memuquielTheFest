import React, { useEffect } from "react";
import '../styles/contador.css'

export const Contador = () => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById("flipdown");

      if (el && window.FlipDown) {
        const endDate = new Date("2025-11-08T19:00:00").getTime() / 1000;

        new window.FlipDown(endDate)
          .start()
          .ifEnded(() => {
            console.log("¡Cuenta regresiva terminada!");
          });
      } else {
        console.warn("Ver contador.");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div>
      <div id="flipdown" className="flipdown pb-4"></div>
    </div>
  );
};
