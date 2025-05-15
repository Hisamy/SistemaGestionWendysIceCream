import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import PinkRectangle from '../../../components/main_content/PinkRectangle.jsx';
import NavLeft from '../../../components/nav_left/NavLeft.jsx';
import ConsumibleButton from '../ConsumibleButton.jsx';
import './GestionarConsumible.css';
import inventarioController from '../../../controllers/InventarioController.js';
/**
 * @module GestionarConsumible
 * @description Componente funcional para la gestión de un consumible específico.
 * Permite ver los detalles del consumible, editar su cantidad y nombre, eliminarlo y registrar mermas.
 * Recibe el ID del consumible a través del estado de la ubicación (`location.state`).
 * Utiliza React Hooks para la gestión del estado y efectos secundarios, React Router para la navegación,
 * y SweetAlert2 para la presentación de alertas y confirmaciones al usuario.
 *
 * @requires react
 * @requires react-router-dom
 * @requires sweetalert2
 * @requires components/NavLeft
 * @requires components/PinkRectangle
 * @requires components/ConsumibleButton
 * @requires ./GestionarConsumible.css
 */
function GestionarConsumible() {
  /**
   * Hook de React Router para obtener la función `navigate`, que permite la navegación programática entre rutas.
   * @constant {function} navigate
   */
  const navigate = useNavigate();

  /**
   * Hook de React Router para acceder al objeto `location`, que contiene información sobre la ruta actual.
   * Se utiliza para recibir el ID del consumible a gestionar.
   * @constant {object} location
   */
  const location = useLocation();

  /**
   * Estado local para almacenar los detalles del consumible que se está gestionando.
   * @state {object} consumible
   * @default {}
   */
  const [consumible, setConsumible] = useState({});

  /**
   * Hook de efecto que se ejecuta al montar el componente y cuando `location.state` o `navigate` cambian.
   * Su función es obtener los datos del consumible a partir del ID pasado en el estado de la ubicación.
   * Si no se recibe un ID válido, redirige al usuario a la página de gestión de inventario.
   * Realiza una llamada asíncrona a `inventarioController.obtenerConsumible` para obtener los detalles.
   * @useEffect
   * @async
   * @dependency {object} location.state
   * @dependency {function} navigate
   */
  useEffect(() => {
    const datosConsumible = async () => {
      try {
        const consumibleObtenido = location.state?.id;
        console.log(consumibleObtenido);
        if (!consumibleObtenido) {
          navigate('/gestionar-inventario');
          return;
        }
        const data = await inventarioController.obtenerConsumible(consumibleObtenido);
        setConsumible(data);
      } catch (error) {
        console.error('Error al obtener el consumible:', error);
      }
    };

    datosConsumible();
  }, [location.state, navigate]);

  /**
   * Función memoizada para manejar la edición de la cantidad del consumible.
   * Utiliza SweetAlert2 para mostrar un diálogo con un input numérico para la nueva cantidad.
   * Calcula la diferencia entre la nueva cantidad y la actual y llama a `inventarioController.editarConsumible`
   * para actualizar la cantidad en el backend. Muestra mensajes de éxito o error al usuario.
   * @function handleEditarCantidad
   * @async
   * @dependency {object} consumible
   */
  const handleEditarCantidad = useCallback(async () => {
    console.log('Agregando cantidad...');
    const { value: nuevaCantidad } = await Swal.fire({
      title: 'Agregar Cantidad',
      input: 'number',
      inputValue: consumible.cantidad,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      background: '#FFFDEA',
      confirmButtonColor: '#FBD275',
      cancelButtonColor: '#E989A4'
    });
    const cantidadNum = Number(nuevaCantidad);
    if (cantidadNum) {
      try {
        const diferencia = cantidadNum - consumible.cantidad;
        const nuevoConsumible = {
          nombre: consumible.nombre,
          cantidad: diferencia
        };
        await inventarioController.editarConsumible(consumible.id, nuevoConsumible);
        Swal.fire({
          title: '¡Actualización Exitosa!',
          text: `La cantidad ha sido actualizada.`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A2576C'
        });
        const data = await inventarioController.obtenerConsumible(consumible.id);
        setConsumible(data);
      } catch (error) {
        console.error("Error al actualizar la cantidad:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la cantidad. Recuerda que aqui no se resta cantidad.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A2576C'
        });
      }
    }
  }, [consumible]);

  /**
   * Función memoizada para manejar la edición del nombre del consumible.
   * Utiliza SweetAlert2 para mostrar un diálogo con un input de texto para el nuevo nombre.
   * Llama a `inventarioController.editarConsumible` para actualizar el nombre en el backend.
   * Actualiza el estado local del consumible con el nuevo nombre.
   * @function handleEditarNombre
   * @async
   * @dependency {object} consumible
   */
  const handleEditarNombre = useCallback(async () => {
    console.log('Editando nombre...');
    const { value: nuevoNombre } = await Swal.fire({
      title: 'Editar Nombre',
      input: 'text',
      inputValue: consumible?.nombre,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      background: '#FFFDEA',
      confirmButtonColor: '#FBD275',
      cancelButtonColor: '#E989A4'
    });

    if (nuevoNombre) {
      try {
        const nuevoConsumible = {
          cantidad: consumible.cantidad,
          nombre: nuevoNombre
        };
        console.log(nuevoConsumible);
        await inventarioController.editarConsumible(consumible.id, nuevoConsumible);
        Swal.fire({
          title: '¡Actualización Exitosa!',
          text: `El nombre ha sido actualizado a ${nuevoNombre}.`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A2576C'
        });
        setConsumible(prev => ({
          ...prev,
          nombre: nuevoNombre
        }));
      } catch (error) {
        console.error("Error al actualizar el nombre:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el nombre. Intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A2576C'
        });
      }
    }
  }, [consumible]);

  /**
   * Función memoizada para manejar la eliminación del consumible.
   * Muestra una confirmación al usuario utilizando SweetAlert2 antes de proceder con la eliminación.
   * Llama a `inventarioController.eliminarConsumible` para eliminar el consumible del backend.
   * Navega de vuelta a la página de gestión de inventario en caso de éxito.
   * @function handleEliminarConsumible
   * @async
   * @dependency {object} consumible
   * @dependency {function} navigate
   * @dependency {object} inventarioController
   */
  const handleEliminarConsumible = useCallback(() => {
    console.log('Eliminando consumible...');
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar ${consumible?.nombre}?`, // Cambiado de name a nombre para mantener consistencia
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#FFFDEA',
      confirmButtonColor: '#FBD275',
      cancelButtonColor: '#E989A4'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Llamar al método del controlador para eliminar el consumible
          await inventarioController.eliminarConsumible(consumible.id);
          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Eliminación Exitosa!',
            text: 'El consumible ha sido eliminado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A2576C'
          });
          // Navegar de vuelta a la página de inventario
          navigate('/gestionar-inventario');
        } catch (error) {
          console.error("Error al eliminar el consumible:", error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar un consumible que esté ligado a un producto. Intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#A2576C'
          });
        }
      }
    });
  }, [consumible, navigate, inventarioController]);

  /**
   * Función memoizada para manejar el registro de mermas del consumible.
   * Utiliza SweetAlert2 para mostrar un diálogo con un input numérico para la cantidad de merma.
   * Actualiza el estado local del consumible con la nueva cantidad de merma.
   * @function handleRegistrarMerma
   */
  const handleRegistrarMerma = useCallback(() => {
    console.log('Registrando merma...');
    // Implement merma registration functionality
    Swal.fire({
      title: 'Registrar Merma',
      input: 'number',
      inputValue: 0,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      background: '#FFFDEA',
      confirmButtonColor: '#FBD275',
      cancelButtonColor: '#E989A4'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Nueva merma: ${result.value}`);
        // Update state
        setConsumible(prev => ({
          ...prev,
          merma: (prev.merma || 0) + parseInt(result.value)
        }));
        // Aquí también deberías llamar a la API para guardar la merma en el backend
      }
    });
  }, []);

  /**
   * Manejador de eventos para el clic en el botón "Cancelar".
   * Navega de vuelta a la página de gestión de inventario.
   * @function handleCancelar
   */
  const handleCancelar = () => {
    console.log('Cancelando...');
    navigate('/gestionar-inventario');
  };

  /**
   * Array de objetos que define los botones para el componente `NavLeft`.
   * Cada objeto especifica la etiqueta del botón, la función a ejecutar al hacer clic y la variante de estilo.
   * @constant {Array<Object>} navLeftButtons
   */
  const navLeftButtons = [
    {
      label: 'Agregar Cantidad',
      onClick: handleEditarCantidad,
      variant: 'primary'
    },
    {
      label: 'Editar Nombre',
      onClick: handleEditarNombre,
      variant: 'primary'
    },
    {
      label: 'Eliminar Consumible',
      onClick: handleEliminarConsumible,
      variant: 'danger'
    },
    {
      label: 'Registrar Mermas',
      onClick: handleRegistrarMerma,
      variant: 'warning'
    },
    {
      label: 'Cancelar',
      onClick: handleCancelar,
      variant: 'secondary'
    }
  ];

  /**
   * Renderizado del componente `GestionarConsumible`.
   * Muestra una navegación izquierda con los botones de acción y un área de contenido principal
   * dentro de un `PinkRectangle` que muestra los detalles del consumible seleccionado.
   * @returns {JSX.Element}
   */
  return (
    <div className="container">
      <div className='nav-left'>
        <NavLeft
          instruction={"Agregar cambios."}
          buttons={navLeftButtons} />
      </div>
      <div className='fit-parent'>
        <div className="content">
          <PinkRectangle >
            {consumible && (
              <div className="consumible-details">
                <div className="consumible-name-container">
                  <ConsumibleButton
                    label={consumible.nombre}
                    onClick={handleEditarNombre}
                    selected={true}
                  />
                </div>
                <div className="consumible-info-container">
                  <div className="consumible-info">
                    <h3><strong>ID</strong></h3>
                    <p> {consumible.id}</p>
                  </div>
                  <div className="consumible-info">
                    <h3><strong>Cantidad</strong></h3>
                    <p> {consumible.cantidad}</p>
                  </div>
                  <div className="consumible-info">
                    <h3><strong>Merma</strong> </h3>
                    <p>{consumible.merma || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </PinkRectangle>
        </div>
      </div>
    </div>
  );
}

export default GestionarConsumible;