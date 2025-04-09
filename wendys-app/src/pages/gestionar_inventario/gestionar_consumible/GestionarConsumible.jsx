import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import PinkRectangle from '../../../components/main_content/PinkRectangle.jsx';
import NavLeft from '../../../components/nav_left/NavLeft.jsx';
import ConsumibleButton from '../ConsumibleButton.jsx';
import './GestionarConsumible.css';
import inventarioController from '../../../controllers/InventarioController.js';

function GestionarConsumible() {
  const navigate = useNavigate();
  const location = useLocation();
  const [consumible, setConsumible] = useState({});

  useEffect(() => {
    const datosConsumible = async () => {
      try {
          const consumibleObtenido = location.state?.id;
          console.log(consumibleObtenido);
          if(!consumibleObtenido){
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
    if(cantidadNum){
      try {

        const diferencia = cantidadNum - consumible.cantidad;

        const nuevoConsumible = {
          nombre: consumible.nombre,
          cantidad: diferencia
        }

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

  const handleEditarNombre = useCallback(async () => {
    console.log('Editando nombre...');
    const {value: nuevoNombre} = await Swal.fire({
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
    
    if(nuevoNombre){
      try {
        const nuevoConsumible = {
          cantidad: consumible.cantidad,
          nombre: nuevoNombre
        }
        console.log(nuevoConsumible);
        await inventarioController.editarConsumible(consumible.id, nuevoConsumible);

        Swal.fire({
          title: '¡Actualización Exitosa!',
          text: `El nombre ha sido actualizado a ${nuevoNombre}.`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A2576C'
        });

        // Actualizar el estado local del consumible
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
          text: 'No se pudo eliminar el consumible. Intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#A2576C'
        });
      }
    }
  });
}, [consumible, navigate, inventarioController]);

  //ESTE NO SE ENCUENTRA EN ESTA ITERACION
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
          merma: prev.merma + parseInt(result.value)
        }));
      }
    });
  }, []);

  const handleCancelar = useCallback(() => {
    console.log('Cancelando...');
    navigate('/gestionar-inventario');
  }, [navigate]);

  const buttons = [
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

  return (
    <div className="inventario-container">
      <NavLeft 
      instruction={"Agregar cambios."}
      buttons={buttons} />
      <div className="inventario-content">
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
  );
}

export default GestionarConsumible;