import React, { useEffect } from "react";
import '../styles/contador.css'

export const Contador = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById("flipdown");

      if (el && window.FlipDown) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 2);

        const endDate = fecha.getTime() / 1000;


        new window.FlipDown(endDate)
          .start()
          .ifEnded(() => {
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
