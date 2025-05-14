import React from 'react';
import PropTypes from 'prop-types';
import './ProductoButton.css';

/**
 * @component
 * @description Un botón visual que puede incluir una imagen y un texto (label) para representar un producto.
 */
const ProductoButton = ({ label, image, onClick, selected = false }) => {
  return (
    <div className="producto-button-container">
      <button
        onClick={onClick}
        className={`producto-button ${selected ? 'selected' : ''}`}
      >
        {image && <img src={image} alt={label} />}
      </button>
      <p className="producto-label">{label}</p>
    </div>
  );
};

/**
 * @propTypes
 * @type {object}
 * @property {string} label - El texto que se mostrará debajo del botón (nombre del producto). Este prop es requerido.
 * @property {string} [image] - La ruta o URL de la imagen que se mostrará dentro del botón. Es opcional.
 * @property {function} onClick - La función que se ejecutará cuando se haga clic en el botón. Este prop es requerido.
 * @property {boolean} [selected=false] - Un valor booleano que indica si el botón está actualmente seleccionado.
 * Si es `true`, se puede aplicar un estilo visual diferente (aunque no se ve en el código proporcionado). Por defecto es `false`.
 */
ProductoButton.propTypes = {
  label: PropTypes.string.isRequired,
  image: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool
};

export default ProductoButton;