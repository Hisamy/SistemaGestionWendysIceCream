import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DetallesButton from './DetallesButton';
import './FormDetallesProducto.css';

function FormDetallesProducto({ fields }) {
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleButtonSelection = (fieldId, option) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: option
    }));
  };

  const renderField = (field) => {
    const { id, type, label, options = [] } = field;



    switch (type) {
      case 'text':
        return (
          <div key={id} className='detalles'>
            <label >{label}</label>
            <input 
            className='input-text'
              type="text"
              value={formValues[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder={`Ingrese ${label.toLowerCase()}`}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div key={id} className='detalles'>
            <label >{label}</label>
            <textarea
            className='input-text'
              value={formValues[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder={`Ingrese ${label.toLowerCase()}`}
            />
          </div>
        );
      
      case 'buttons':
        return (
          <div key={id} className='Detalles'>
            <label >{label}</label>
            <div >
              {options.map(option => (
                <DetallesButton
                  key={option}
                  label={option}
                  selected={formValues[id] === option}
                  onClick={() => handleButtonSelection(id, option)}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
      <form className='form-detalles-map'>
        {fields.map(renderField)}
      </form>

  );
}

FormDetallesProducto.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'textarea', 'buttons']).isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired
};

export default FormDetallesProducto;