import PropTypes from 'prop-types';
import './ConsumibleButton.css'

/**
 * @component
 * @description Un botón reutilizable para seleccionar consumibles.
 * Este componente visualiza un botón con un texto (label)
 * y permite indicar si está seleccionado mediante una propiedad.
 */
const ConsumibleButton = ({ label, onClick, selected = false }) => {
    return (
        <button
            onClick={onClick}
            className={`consumible-button ${selected ? 'selected' : ''}`}
        >
            {label}
        </button>
    );
};

/**
 * @propTypes
 * @type {object}
 * @property {string} label - El texto que se mostrará en el botón. Este prop es requerido.
 * @property {function} onClick - La función que se ejecutará cuando se haga clic en el botón. Este prop es requerido.
 * @property {boolean} [selected=false] - Un valor booleano que indica si el botón está actualmente seleccionado.
 * Si es `true`, se aplicará un estilo visual diferente. Por defecto es `false`.
 */
ConsumibleButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool
};

export default ConsumibleButton;