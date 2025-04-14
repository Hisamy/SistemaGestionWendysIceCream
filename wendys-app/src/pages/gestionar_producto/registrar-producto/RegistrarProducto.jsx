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
      // 1. Cargar datos base del producto
      const savedData = sessionStorage.getItem('productoDraft');
      if (savedData) {
        const { nombre, variantes, imagen } = JSON.parse(savedData);


        // Actualizar estado PRINCIPAL primero
        setDatosProducto({ nombre, variantes });

        // Cargar imagen si existe
        if (imagen) {
          try {
            const binaryString = atob(imagen.data);
            const bytes = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: imagen.type });
            const file = new File([blob], imagen.name, { type: imagen.type });
            setImagenProducto(file);
            setNombreImagen(imagen.name);

          } catch (error) {
            console.error("Error al reconstruir imagen:", error);
          }
        }
      }

      // 2. Cargar consumibles DESPUÉS de cargar los datos base
      const storedConsumibles = sessionStorage.getItem('selectedConsumibles');
      if (storedConsumibles) {
        const { variantIndex, consumibles } = JSON.parse(storedConsumibles);

        setDatosProducto(prev => {

          const nuevasVariantes = prev.variantes.map((v, i) => {
            if (i === variantIndex) {
              const nuevosConsumibles = consumibles.map(c => {
                const consumibleConvertido = {
                  id: Number(c.id),
                  cantidad: Number(c.cantidad)
                };
                return consumibleConvertido;
              });

              const varianteActualizada = {
                ...v,
                consumibles: nuevosConsumibles
              };
              return varianteActualizada;
            }
            return v;
          });

          const nuevoEstado = {
            ...prev,
            variantes: nuevasVariantes
          };
          return nuevoEstado;
        });

        sessionStorage.removeItem('selectedConsumibles');
      }
    };

    loadPersistedData();
  }, []);

  // Guardar datos automáticamente
  useEffect(() => {
    const saveData = async () => {
      let imagenData = null;

      if (imagenProducto) {
        try {
          const arrayBuffer = await imagenProducto.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          // Método optimizado para grandes archivos
          let binaryString = '';
          const chunkSize = 32768; // Tamaño de chunk seguro

          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.subarray(i, i + chunkSize);
            binaryString += String.fromCharCode.apply(null, chunk);
          }

          imagenData = {
            name: imagenProducto.name,
            type: imagenProducto.type,
            data: btoa(binaryString)
          };
        } catch (error) {
          console.error("Error al procesar imagen:", error);
        }
      }

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
      // Validar datos mínimos
      if (!datosProducto.nombre || datosProducto.variantes.length === 0) {
        throw new Error('Debe completar todos los campos requeridos');
      }

      // Crear FormData con estructura correcta
      const formData = new FormData();

      const productoData = {
        nombre: datosProducto.nombre,
        variantes: datosProducto.variantes.map(variante => ({
          tamanio: variante.tamanio,
          precio: Number(variante.precio),
          consumibles: variante.consumibles.map(c => ({
            id: Number(c.id),
            cantidad: Number(c.cantidad)
          }))
        }))
      };

      // 2. Adjuntar datos como JSON
      formData.append('datosProducto', JSON.stringify(productoData));

      // 3. Adjuntar imagen si existe
      if (imagenProducto) {
        formData.append('imagen', imagenProducto);
      }

      // 4. Enviar al servidor
      await productoController.registrarProducto(formData);

      // Limpiar datos y mostrar éxito
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