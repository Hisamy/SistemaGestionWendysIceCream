import React, { useState } from 'react';
import './AmountConsumibleButton.css'


function AmountConsumibleButton () {
    const [amount, setAmount] = useState(0);

    const handleIncrement = () => {
        setAmount(amount + 1);
      };

      const handleDecrement = () => {
        if (amount > 0) {
          setAmount(amount - 1);
        }
      };

    return(
        <div className='container-amount'>
            <button onClick={handleDecrement} className='button-decrement'>-</button>
            <p className='amount'>{amount}</p>
            <button onClick={handleIncrement} className='button-increment'>+</button>

        </div>
    );

}
export default AmountConsumibleButton;