import React from "react";
import wendysImage from "../../assets/Images/wendys-inicio.png"
import './inicio.css';
function Inicio() {
    return (
        <div className="inicio-container">
            <div className="fondo-puntos">
                <div className="mensaje">
                    <h1 className="un-mundo">¡Un mundo</h1>
                    <h1 className="de-sabor">de sabor!</h1>
                </div>
            </div>
            <div className="circulo-imagen">

            </div>
            <img src={wendysImage} alt="Helado" className="imagen-helado" />
        </div>
    );
}

export default Inicio;