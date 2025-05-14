import { useState } from 'react';

const DimensionesFormEditable = ({ index, variant, onUpdate, onRemove, onSelectConsumibles }) => {
  const [inputValue, setInputValue] = useState(variant.precio || '');


  // Manejar cambios en el select (para actualizar inmediatamente)
  const handleSelectChange = (e) => {
    onUpdate(index, 'tamanio', e.target.value);
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
            onChange={handleSelectChange}
            className="tamano-select"
          >
            <option value="UNICO">Tamaño unico</option>
            <option value="CHICO">Chico</option>
            <option value="MEDIANO">Mediano</option>
            <option value="GRANDE">Grande</option>
          </select>
        </div>
        <div className="form-field ">
          <input
            type="number"
            name="precio"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              const numValue = parseFloat(inputValue);
              if (!isNaN(numValue)) {
                onUpdate(index, 'precio', numValue);
              }
            }}
            placeholder="Precio"
            step="0.01"
            min="0"
            className="precio-input"
          />
        </div>
        <button
          type='button'
          className="consumibles-button"
          onClick={() => onSelectConsumibles(index)}
        >
          Consumibles
        </button>
      </div>
    </div>
  );
};

export default DimensionesFormEditable;