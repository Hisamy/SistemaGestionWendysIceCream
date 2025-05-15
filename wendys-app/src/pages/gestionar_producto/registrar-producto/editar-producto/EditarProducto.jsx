import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import NavLeft from "../../../../components/nav_left/NavLeft";
import productoController from '../../../../controllers/ProductoController';
import PinkRectangle from '../../../../components/main_content/PinkRectangle';
import { API_URL } from '../../../../utils/api';
import './EditarProducto.css'

/**
 * @module EditarProducto
 * @description Componente funcional para la edición de la información de un producto existente.
 * Permite modificar el nombre y la imagen del producto, y ofrece la opción de navegar a la gestión de variables del producto.
 * Utiliza React Hooks para la gestión del estado y efectos secundarios, React Router para la navegación,
 * y SweetAlert2 para la presentación de alertas y confirmaciones al usuario.
 *
 * @requires react
 * @requires react-router-dom
 * @requires sweetalert2
 * @requires components/NavLeft
 * @requires components/PinkRectangle
 * @requires ./EditarProducto.css
 */
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

    /**
     * Hook de efecto que se ejecuta cuando el valor de `productoRecibido` cambia.
     * Su función es cargar la información del producto en el estado local si se reciben datos,
     * o establecer un mensaje de error si no se reciben.
     * @useEffect
     * @dependency {object | undefined} productoRecibido
     */
    useEffect(() => {
        if (productoRecibido) {
            setProducto(productoRecibido);
            setNombre(productoRecibido.nombre || productoRecibido.name);
            setImagenUrl(productoRecibido.imagenPath || productoRecibido.imagenUrl);
        } else {
            setError('No se recibieron los datos del producto para editar.');
        }
    }, [productoRecibido]);

    /**
     * Manejador de eventos para el cambio en el campo de entrada del nombre.
     * Actualiza el estado `nombre` con el nuevo valor del input.
     * @function handleNombreChange
     * @param {React.ChangeEvent<HTMLInputElement>} event - Objeto del evento de cambio.
     */
    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    /**
     * Manejador de eventos para el clic en el botón de subir imagen.
     * Muestra una alerta informativa sobre los formatos de imagen aceptados utilizando SweetAlert2
     * y luego simula un clic en el input de tipo 'file' para abrir el diálogo de selección de archivos.
     * @function handleButtonClick
     */
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

    /**
     * Manejador de eventos para el cambio en el input de tipo 'file' (selector de archivos de imagen).
     * Valida el formato del archivo seleccionado y, si es válido, actualiza el estado `nuevaImagen`
     * y genera una URL para la previsualización de la imagen en el estado `imagenPreview`.
     * Si el formato no es válido, muestra una alerta de error.
     * @function handleImagenChange
     * @param {React.ChangeEvent<HTMLInputElement>} event - Objeto del evento de cambio.
     */
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

    /**
     * Hook de efecto para la limpieza de la URL del objeto de la imagen de previsualización.
     * Se ejecuta cuando el componente se desmonta o cuando el valor de `imagenPreview` cambia.
     * Revoca la URL del objeto para liberar recursos del navegador y evitar posibles fugas de memoria.
     * @useEffect
     * @dependency {string} imagenPreview
     */
    useEffect(() => {
        return () => {
            if (imagenPreview) {
                URL.revokeObjectURL(imagenPreview);
            }
        };
    }, [imagenPreview]);

    /**
     * Función asíncrona para guardar los cambios realizados en el producto.
     * Realiza validaciones de los datos, construye un objeto `FormData` para enviar los datos al servidor
     * (incluyendo la posible nueva imagen), y llama a una función del controlador de productos para actualizar la información.
     * Utiliza SweetAlert2 para mostrar mensajes de éxito o error al usuario y navega a la página de gestión de productos en caso de éxito.
     * @async
     * @function handleGuardarCambios
     */
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
                    text: 'El producto se actualizó correctamente',
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

    /**
     * Manejador de eventos para el clic en el botón de modificar variables.
     * Navega a la página de modificación de variables del producto, pasando el ID del producto a través del estado de la ruta.
     * Muestra una advertencia si el ID del producto no está disponible.
     * @function handleModificarVariables
     */
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

    /**
     * Array de objetos que define los botones para el componente `NavLeft`.
     * Cada objeto especifica la etiqueta del botón, la función a ejecutar al hacer clic y la variante de estilo.
     * @constant {Array<Object>} navLeftButtons
     */
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

    /**
    * Renderizado condicional en caso de que se haya producido un error al cargar los datos del producto.
    * Muestra un mensaje de error dentro de un contenedor.
    * @returns {JSX.Element | null}
    */
    if (error) {
        return <div className="container">{error}</div>;
    }

    /**
     * Renderizado condicional mientras se está cargando la información del producto.
     * Muestra un mensaje de carga dentro de un contenedor.
     * @returns {JSX.Element | null}
     */
    if (!producto) {
        return <div className="container">Cargando información del producto...</div>;
    }

    /**
     * Renderizado principal del componente `EditarProducto`.
     * Contiene la estructura de la interfaz de usuario para la edición del producto,
     * incluyendo el componente `NavLeft` con los botones de acción, y un formulario dentro de `PinkRectangle`
     * para la modificación del nombre y la imagen del producto.
     * @returns {JSX.Element}
     */
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