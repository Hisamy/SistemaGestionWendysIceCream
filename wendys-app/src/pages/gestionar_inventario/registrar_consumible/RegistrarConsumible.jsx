import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import PinkRectangle from '../../../components/main_content/PinkRectangle.jsx';
import NavLeft from '../../../components/nav_left/NavLeft.jsx';
import './RegistrarConsumible.css';
import inventarioController from '../../../controllers/InventarioController.js';

function RegistrarConsumible() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'nombre' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await inventarioController.registrarConsumible(formData);

      Swal.fire({
        title: '¡Registro Exitoso!',
        text: 'Consumible registrado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#A2576C'
      }).then(() => {
        navigate('/gestionar-inventario');
      });
  
      setSuccess(true);

    } catch (error) {
      console.error("Error al registrar el consumible:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo registrar el consumible. Intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#A2576C'
      });
      setError(error.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCancel = () => {
    navigate('/gestionar-inventario'); // Regresar a la página de inventario
  };

  const buttons = [
    {
      label: 'Agregar',
      onClick: () => document.getElementById('register-form').requestSubmit(),
      variant: 'primary'
    },
    {
      label: 'Cancelar',
      onClick: handleCancel,
      variant: 'secondary'
    }
  ];

  return (
    <div className="registrar-container">
      <div className='nav-left'>
        <NavLeft
          instruction="Ingrersa los datos del nuevo consumible a registrar."
          buttons={buttons}
        />
      </div>
      <div className="fit-parent">
        <div className="registrar-content">
          <PinkRectangle>
            <div className="form-container">
              <form id="register-form" onSubmit={handleSubmit} className="consumible-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre Consumible:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cantidad">Cantidad:</label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    min="0"
                    required
                    className="form-input"
                  />
                </div>
                
              </form>
            </div>
          </PinkRectangle>
        </div>
      </div>
    </div>
  );
}

export default RegistrarConsumible;