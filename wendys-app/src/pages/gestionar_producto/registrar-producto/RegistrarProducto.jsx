import React, { useState, useEffect } from 'react';
import NavLeft from '../../../components/nav_left/NavLeft.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import PinkRectangle from '../../../components/main_content/PinkRectangle.jsx';
import DimensionesForm from './DimensionesForm.jsx';
import Swal from 'sweetalert2';
import './RegistrarProducto.css';
import productoController from '../../../controllers/ProductoController.js';


function RegistrarProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  const [datosProducto, setDatosProducto] = useState({
    nombre: '',
    variantes: [
      {
        tamanio: 'UNICO',
        precio: 0,
        consumibles: []
      }
    ],
  });
  const [imagenProducto, setImagenProducto] = useState(null);
  const [nombreImagen, setNombreImagen] = useState('Seleccionar imagen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos persistentes
  useEffect(() => {
    const loadPersistedData = () => {
      // Cargar datos del producto
      const savedData = sessionStorage.getItem('productoDraft');
      if (savedData) {
        const { nombre, variantes, imagen } = JSON.parse(savedData);
        setDatosProducto({ nombre, variantes });
        
        // Cargar imagen si existe
        if (imagen) {
          const byteString = atob(imagen.data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: imagen.type });
          const file = new File([blob], imagen.name, { type: imagen.type });
          setImagenProducto(file);
          setNombreImagen(imagen.name);
        }
      }

      // Cargar consumibles seleccionados
      const storedConsumibles = sessionStorage.getItem('selectedConsumibles');
      if (storedConsumibles) {
        const { variantIndex, consumibles } = JSON.parse(storedConsumibles);
        setDatosProducto(prev => ({
          ...prev,
          variantes: prev.variantes.map((v, i) => 
            i === variantIndex ? { ...v, consumibles } : v
          )
        }));
        sessionStorage.removeItem('selectedConsumibles');
      }
    };

    loadPersistedData();
  }, []);

  // Guardar datos automáticamente
  useEffect(() => {
    const saveData = () => {
      const imagenData = imagenProducto ? {
        name: imagenProducto.name,
        type: imagenProducto.type,
        data: btoa(String.fromCharCode(...new Uint8Array(imagenProducto.arrayBuffer())))
      } : null;

      const draftData = {
        nombre: datosProducto.nombre,
        variantes: datosProducto.variantes,
        imagen: imagenData
      };

      sessionStorage.setItem('productoDraft', JSON.stringify(draftData));
    };

    if (location.pathname === '/registrar-producto') {
      saveData();
    }
  }, [datosProducto, imagenProducto, location]);

  // Limpiar datos al desmontar
  useEffect(() => {
    return () => {
      if (!window.location.pathname.includes('/elegir-consumibles')) {
        sessionStorage.removeItem('productoDraft');
        sessionStorage.removeItem('selectedConsumibles');
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosProducto(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const updateVariantData = (index, field, value) => {
    setDatosProducto(prev => {
      const newVariantes = [...prev.variantes];
      newVariantes[index][field] = value;
      return { ...prev, variantes: newVariantes };
    });
  };

  const addVariant = () => {
    setDatosProducto(prev => ({
      ...prev,
      variantes: [...prev.variantes, {
        tamanio: 'UNICO',
        precio: 0,
        consumibles: []
      }]
    }));
  };

  const removeVariant = (index) => {
    setDatosProducto(prev => ({
      ...prev,
      variantes: prev.variantes.filter((_, i) => i !== index)
    }));
  };

  const handleImagenProductoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNombreImagen(file.name);
      setImagenProducto(file);
    }
  };

  // Limpiar datos al enviar exitosamente
  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await productoController.registrarProducto(datosProducto, imagenProducto);
      sessionStorage.clear();
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
    sessionStorage.clear();
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
                      name="nombre"
                      value={datosProducto.nombre || ''}
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
                <DimensionesForm
                  variantes={datosProducto.variantes}
                  onUpdateVariant={updateVariantData}
                  onAddVariant={addVariant}
                  onRemoveVariant={removeVariant}
                />
              </form>
            </div>

          </PinkRectangle>
        </div>
      </div>
    </div>
  );
}
export default RegistrarProducto;