import React from 'react';
import PropTypes from 'prop-types';
import './AmountConsumibleButton.css';

/**
 * @component
 * @description Un componente para controlar la cantidad de un consumible con botones de incremento y decremento.
 */
function AmountConsumibleButton({ quantity, onIncrement, onDecrement }) {
    return (
        <div className='container-amount'>
            <button
                onClick={onDecrement}
                className='button-decrement'
                disabled={quantity <= 0}
            >
                -
            </button>
            <p className='amount'>{quantity}</p>
            <button
                onClick={onIncrement}
                className='button-increment'
            >
                +
            </button>
        </div>
    );
}

/**
 * @propTypes
 * @type {object}
 * @property {number} quantity - La cantidad actual del consumible. Requerido.
 * @property {function} onIncrement - La función que se llama al hacer clic en el botón de incremento. Requerido.
 * @property {function} onDecrement - La función que se llama al hacer clic en el botón de decremento. Requerido.
 */
AmountConsumibleButton.propTypes = {
    quantity: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired
};

export default AmountConsumibleButton;