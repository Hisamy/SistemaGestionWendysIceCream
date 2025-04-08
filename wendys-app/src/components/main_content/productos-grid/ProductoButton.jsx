import React from 'react';
import PropTypes from 'prop-types';
import './ProductoButton.css';

const ProductoButton = ({ label, image, onClick, selected = false }) => {
  return (
    <div className="producto-button-container">
      <button 
        onClick={onClick}
        className='producto-button'
      >
        {image && <img src={image} alt={label} />}
      </button>
      <p>{label}</p>
    </div>
  );
};

ProductoButton.propTypes = {
  label: PropTypes.string.isRequired,
  image: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool
};

export default ProductoButton;