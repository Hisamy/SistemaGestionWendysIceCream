import React, { useState, useCallback } from 'react';
import NavLeft from '../../../components/nav_left/NavLeft.jsx';
import { useNavigate } from 'react-router-dom';
import PinkRectangle from '../../../components/main_content/PinkRectangle.jsx';
import DimensionesForm from './DimensionesForm.jsx';
import Swal from 'sweetalert2';

function RegistrarProducto(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombreProducto: '',
      });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: name === 'nombreProducto' ? value : Number(value)
        }));
      };
        
      const handleSubmitProducto = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        Swal.fire({
            icon: 'success',
            title: '¡Producto Registrado!',
            text: 'El producto se ha registrado correctamente.',
            confirmButtonText: 'Continuar', 
            confirmButtonColor: '#A2576C',
            showCancelButton: false})
            .then(() => {
                navigate('/gestionar-producto'); 
              });
            }

    const handleCancel = () => {
        navigate('/gestionar-producto');
    };

    const navLeftButtons = [
        {
          label: 'Registrar',
          onClick: handleSubmitProducto,
          variant: 'primary'
        },
        {
            label: 'Cancelar',
            onClick: handleCancel,
            variant: 'primary'
          },
      ];

      return (
        <div className="container">
          <div className='nav-left'>
            <NavLeft
              instruction="Ingresar los datos del nuevo producto a registrar"
              buttons={navLeftButtons}
            />
          </div>
          <div className="fit-parent">
            <div className="registrar-content"> 
              <PinkRectangle>
                <div className="form-container">
                  <form id="register-form" className="producto-form">
                    <div className="form-group">
                      <label htmlFor="nombreProducto">Nombre Producto:</label>
                      <input
                        type="text"
                        id="nombreProducto"
                        name="nombreProducto"
                        value={formData.nombreProducto}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <label>Dimensiones:</label>
                    <DimensionesForm />
                  </form>
                </div>
                
              </PinkRectangle>
            </div>
          </div>
        </div>
      );
}
export default RegistrarProducto;