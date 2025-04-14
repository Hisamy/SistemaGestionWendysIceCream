import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import DetallesButton from './DetallesButton';
import './FormDetallesProducto.css';

const FormDetallesProducto = forwardRef(({ fields, onValuesChange }, ref) => {
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (fieldId, value) => {
    const updatedValues = {
      ...formValues,
      [fieldId]: value
    };

    setFormValues(updatedValues);
    
    // Notificar al componente padre sobre los cambios
    if (onValuesChange) {
      onValuesChange(updatedValues);
    }
  };

  const handleButtonSelection = (fieldId, option) => {
    handleInputChange(fieldId, option);
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

  // Exponer el método getFormValues a través de la ref
  useImperativeHandle(ref, () => ({
    getFormValues: () => formValues
  }));


  return (
      <form className='form-detalles-map'>
        {fields.map(renderField)}
      </form>

  );
});

FormDetallesProducto.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'textarea', 'buttons']).isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  onValuesChange: PropTypes.func
};

export default FormDetallesProducto;