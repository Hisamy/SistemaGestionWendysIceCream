import React, { useState, useCallback } from 'react';
import NavLeft from '../../../components/nav_left/NavLeft.jsx';
import { useNavigate } from 'react-router-dom';
import PinkRectangle from '../../../components/main_content/PinkRectangle.jsx';
import DimensionesForm from './DimensionesForm.jsx';
import Swal from 'sweetalert2';
import './RegistrarProducto.css'
import productoController from '../../../controllers/ProductoController.js'

function RegistrarProducto() {
  const navigate = useNavigate();
  const tamanioDefault = productoController.obtenerTamanioDefult();
  const [datosProducto, setDatosProducto] = useState({
    nombre: '',
    variantes: [
      {
        tamanio: tamanioDefault,
        consumibles: []
      }
    ],
  });
  const [imagenProducto, setImagenProducto] = useState(null);
  const [nombreImagen, setNombreImagen] = useState('Seleccionar imagen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosProducto(prevData => ({
      ...prevData,
      [name]: name === 'nombreProducto' ? value : Number(value)
    }));
  };

  const handleImagenProductoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setNombreImagen(file.name);
      setImagenProducto(e.target.files[0]);
    }
  }

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await productoController.registrarProducto(datosProducto, imagen);
      Swal.fire({
        icon: 'success',
        title: '¡Producto Registrado!',
        text: 'El producto se ha registrado correctamente.',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#A2576C',
        showCancelButton: false
      })
        .then(() => {
          navigate('/gestionar-producto');
        });

    } catch (error) {
      setError("Error al registrar producto");
      console.error(error);
    } finally {
      setLoading(false);
    }
    
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
                    <div className="form-group-producto">
                    <div className='nombre-producto'>
                      <label htmlFor="nombreProducto">Nombre Producto</label>
                      <input
                        type="text"
                        id="nombreProducto"
                        name="nombreProducto"
                        value={datosProducto.nombre}
                        onChange={handleChange}
                        required
                        className="form-input-text"
                      />
                      </div>
                      <div className='imagen-producto'>
                        <label htmlFor="imagenProducto">Subir imágen</label>
                          <input
                            type="file"
                            id="imagenProducto"
                            name="imagenProducto"
                            accept="image/*"
                            onChange={handleImagenProductoChange}
                            className="form-input-image"
                            style={{ display: 'none' }} // 🔹 Esto oculta el input nativo
                          />
                        <label htmlFor="imagenProducto" className="boton-subir">
                          {nombreImagen}
                        </label>
                      </div>

                      </div>
                      
                    <label>Dimensiones</label>
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