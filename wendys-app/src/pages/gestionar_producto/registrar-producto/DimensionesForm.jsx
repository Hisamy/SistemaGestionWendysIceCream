// components/DimensionesForm/DimensionesForm.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DimensionesForm.css';

const FormDimension = ({ index, variant, onUpdate, onRemove, onSelectConsumibles }) => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    onUpdate(index, e.target.name, e.target.value);
  };


  const handleConsumiblesClick = () => {
    
    navigate('/elegir-consumibles', { 
      state: { 
        variantIndex: index,
        consumiblesActuales: variant.consumibles
      } 
    });
  };

  return (
    <div className="dimension-form">
      <div className="dimension-header">
        <button className="delete-button" onClick={() => onRemove(index)}>X</button>
      </div>
      <div className="dimension-content">
        <div className="form-field">
          <select
            name='tamanio'
            value={variant.tamanio}
            onChange={handleChange}
            className="tamano-select"
          >
            <option value="UNICO">Tamaño unico</option>
            <option value="CHICO">Pequeño</option>
            <option value="MEDIANO">Mediano</option>
            <option value="GRANDE">Grande</option>
          </select>
        </div>
        <div className="form-field ">
          <input
            type="number"
            name="precio"
            value={variant.precio}
            onChange={(e) => onUpdate(index, 'precio', Number(e.target.value))}
            placeholder="Precio"
            step="0.01"
            min="0"
            className="precio-input"
          />
        </div>
        <button
          type='button'
          className="consumibles-button"
          onClick={handleConsumiblesClick}
        >
          Consumibles ({variant.consumibles.length})
        </button>
      </div>
    </div>
  );
};

const DimensionesForm = ({ variantes, onUpdateVariant, onAddVariant, onRemoveVariant }) => {

  return (
    <div className="dimensiones-container">
      {variantes.map((variant, index) => (
        <FormDimension
          key={index}
          index={index}
          variant={variant}
          onUpdate={onUpdateVariant}
          onRemove={onRemoveVariant}
        />
      ))}
      <button type="button" onClick={onAddVariant}>+</button>
    </div>
  );
};

export default DimensionesForm;