// components/DimensionesForm/DimensionesForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DimensionesForm.css'; 

const FormDimension = ({ onDelete, index }) => {
  const navigate = useNavigate();
  const [tamano, setTamano] = useState('');
  const [precio, setPrecio] = useState('');

  const handleTamanoChange = (e) => {
    setTamano(e.target.value);
  };

  const handlePrecioChange = (e) => {
    setPrecio(e.target.value);
  };

  const handleConsumiblesClick = () => {
    navigate('/consumibles');
  };

  return (
    <div className="dimension-form">
      <div className="dimension-header">
        <button className="delete-button" onClick={() => onDelete(index)}>X</button>
      </div>
      <div className="dimension-content">
        <div className="form-field">
          <select 
            value={tamano} 
            onChange={handleTamanoChange}
            className="tamano-select"
          >
            <option value="" disabled>Tamaño unico</option>
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
        </div>
        <div className="form-field ">
          <input 
            type="number" 
            value={precio}
            onChange={handlePrecioChange}
            placeholder="Precio"
            className="precio-input"
          />
        </div>
        <button 
          className="consumibles-button"
          onClick={handleConsumiblesClick}
        >
          Consumibles
        </button>
      </div>
    </div>
  );
};

const DimensionesForm = () => {
  const [forms, setForms] = useState([{ id: 1 }]);

  const addForm = () => {
    const newId = forms.length > 0 ? Math.max(...forms.map(form => form.id)) + 1 : 1;
    setForms([...forms, { id: newId }]);
  };

  const deleteForm = (index) => {
    const newForms = [...forms];
    newForms.splice(index, 1);
    setForms(newForms);
  };

  return (
    <div className="dimensiones-container">
      {forms.map((form, index) => (
        <FormDimension 
          key={form.id} 
          index={index} 
          onDelete={deleteForm} 
        />
      ))}
      <button className="add-form-button" onClick={addForm}>+</button>
    </div>
  );
};

export default DimensionesForm;