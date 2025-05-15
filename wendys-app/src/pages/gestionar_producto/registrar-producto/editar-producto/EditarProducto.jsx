import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import NavLeft from "../../../../components/nav_left/NavLeft";
import productoController from '../../../../controllers/ProductoController';
import PinkRectangle from '../../../../components/main_content/PinkRectangle';
import { API_URL } from '../../../../utils/api';
import './EditarProducto.css'


const EditarProducto = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const productoRecibido = location.state?.productoData;
    const [producto, setProducto] = useState(null);
    const [nombre, setNombre] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [imagenPreview, setImagenPreview] = useState('');
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (productoRecibido) {
            setProducto(productoRecibido);
            setNombre(productoRecibido.nombre || productoRecibido.name);
            setImagenUrl(productoRecibido.imagenPath || productoRecibido.imagenUrl);
        } else {
            setError('No se recibieron los datos del producto para editar.');
        }
    }, [productoRecibido]);

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handleButtonClick = () => {
        Swal.fire({
            title: 'Información',
            text: 'Solo se aceptan imágenes en formato JPG, JPEG o PNG',
            icon: 'info',
            iconColor: '#fbd275',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#A2576C'

        }).then(() => {
            document.getElementById('imagen').click();
        });
    };

    const handleImagenChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const fileType = file.type;

            if (fileType !== 'image/jpeg' && fileType !== 'image/png' && fileType !== 'image/jpg') {
                Swal.fire({
                    title: 'Formato no válido',
                    text: 'Solo se aceptan imágenes en formato JPG, JPEG o PNG',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#A2576C'
                });
                return;
            }

            setNuevaImagen(file);
            const objectUrl = URL.createObjectURL(file);
            setImagenPreview(objectUrl);
        }
    };

    useEffect(() => {
        return () => {
            if (imagenPreview) {
                URL.revokeObjectURL(imagenPreview);
            }
        };
    }, [imagenPreview]);

    const handleGuardarCambios = async () => {
        try {
            // Inicializar formData primero
            const formData = new FormData();

            // Validación de datos iniciales
            if (!productoRecibido) {
                throw new Error('No se recibieron datos del producto');
            }

            // Validación de cambios
            const nombreOriginal = productoRecibido.nombre || productoRecibido.name;
            const imagenOriginal = productoRecibido.imagenPath || productoRecibido.imagenUrl;

            if (nombre === nombreOriginal && !nuevaImagen && imagenPreview === imagenOriginal) {
                Swal.fire({
                    title: 'Sin cambios',
                    text: 'No se detectaron modificaciones para guardar',
                    icon: 'info',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#A2576C'
                });
                return;
            }

            // Validación de nombre
            if (!nombre.trim()) {
                Swal.fire({
                    title: 'Campo requerido',
                    text: 'El nombre del producto no puede estar vacío',
                    icon: 'warning',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#A2576C'
                });
                return;
            }

            // Adjuntar datos al formData
            const datosProducto = { nombre: nombre };
            formData.append('datosProducto', JSON.stringify(datosProducto));

            if (nuevaImagen) {
                formData.append('imagen', nuevaImagen);
            }

            // Verificar que el controlador exista
            if (!productoController?.actualizarProducto) {
                throw new Error('Error en el servidor, vuelvalo a intentar más tarde.');
            }

             console.log("FormData antes de enviar:", formData.entries ? Array.from(formData.entries()) : formData);

        const response = await productoController.actualizarProducto(
            productoRecibido.id,
            formData
        );
 // Verificamos si la respuesta contiene una parte del mensaje de éxito esperado
        if (response.includes("actualizado correctamente")) {
            Swal.fire({
                title: '¡Éxito!',
                text: response, // Muestra el mensaje del backend
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#A2576C'
                }).then(() => {
                    navigate('/gestionar-producto');
                });
            } else {
                throw new Error('Respuesta inválida del servidor');
            }

        } catch (error) {
            console.error('Error en handleGuardarCambios:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al guardar los cambios',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#A2576C'
            });
        }
    };

    const handleModificarVariables = () => {
        if (producto && producto.id) {
            navigate('/modificar-variable', { state: { productId: producto.id } });
        } else {
            console.warn('No se puede navegar a modificar-variable porque no se tiene el ID del producto.');
            Swal.fire({
                title: 'Advertencia',
                text: 'No se puede ir a modificar variables porque no se ha cargado la información del producto.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#A2576C'
            });
        }
    };

    const navLeftButtons = [
        {
            label: 'Guardar Cambios',
            onClick: handleGuardarCambios,
            variant: 'primary'
        },
        {
            label: 'Modificar Variables',
            onClick: handleModificarVariables,
            variant: 'secondary'
        },
        {
            label: 'Cancelar',
            onClick: () => navigate('/gestionar-producto'),
            variant: 'secondary'
        }
    ];

    if (error) {
        return <div className="container">{error}</div>;
    }

    if (!producto) {
        return <div className="container">Cargando información del producto...</div>;
    }

    return (
        <div className="container">
            <div className='nav-left'>
                <NavLeft
                    instruction="Edita la información del producto."
                    buttons={navLeftButtons}
                />
            </div>
            <div className="fit-parent">
                <div className="content">
                    <PinkRectangle searchable={false}>
                        <div className='pink-rectangle-container'>
                            <form className="producto-form">
                                <div>
                                    <label htmlFor="nombre">Nombre:</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleNombreChange}
                                    />
                                </div>
                            </form>
                            <div className='imagen-content'>
                                <div className="imagen-container">
                                    {(imagenUrl || imagenPreview) && (
                                        <img
                                            src={imagenPreview || (API_URL + '/images/' + imagenUrl)}
                                            alt={nombre}
                                            className="producto-imagen"
                                        />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="btn-subir-imagen"
                                    onClick={handleButtonClick}
                                >
                                    Subir nueva imagen
                                </button>
                                <input
                                    type="file"
                                    id="imagen"
                                    name="imagen"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleImagenChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                        </div>


                    </PinkRectangle>
                </div>
            </div>
        </div>
    );
};

export default EditarProducto;