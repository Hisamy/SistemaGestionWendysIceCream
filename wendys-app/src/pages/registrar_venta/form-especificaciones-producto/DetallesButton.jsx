import React from 'react';
import PropTypes from 'prop-types';
import './DetallesButton.css'

function DetallesButton({ label, selected, onClick }) {
 

  return (
    <button
        className={`button-detalles ${selected ? 'selected' : ''}`}
        onClick={onClick}
        type="button"
        >
        {label}
</button>

  );
}

DetallesButton.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default DetallesButton;

