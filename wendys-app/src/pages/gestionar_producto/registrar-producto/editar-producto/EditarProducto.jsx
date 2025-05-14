import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import NavLeft from "../../../../components/nav_left/NavLeft";
import productoController from "../../../../controllers/ProductoController";
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
                    confirmButtonText: 'Entendido'
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
        if (!producto) {
            setError('No hay producto para guardar.');
            return;
        }

        const formData = new FormData();
        formData.append('id', producto.id);
        formData.append('nombre', nombre);
        if (nuevaImagen) {
            formData.append('imagen', nuevaImagen);
        }

        try {
            const response = await productoController.actualizarProducto(formData);
            if (response && response.data) {
                alert('Producto actualizado exitosamente!');
                navigate('/gestionar-producto');
            } else {
                setError('Error al guardar los cambios.');
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            setError('Error al guardar los cambios.');
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
            onClick: () => console.log('Modificar Variables'),
            variant: 'secondary'
        },
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