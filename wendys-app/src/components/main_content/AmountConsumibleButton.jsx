import React from 'react';
import PropTypes from 'prop-types';
import './AmountConsumibleButton.css';

function AmountConsumibleButton({ quantity, onIncrement, onDecrement }) {
    return(
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

AmountConsumibleButton.propTypes = {
    quantity: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired
};

export default AmountConsumibleButton;