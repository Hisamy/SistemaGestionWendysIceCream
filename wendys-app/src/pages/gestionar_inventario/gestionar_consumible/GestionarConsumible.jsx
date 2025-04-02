import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

import PinkRectangle from '../../../components/main_content/PinkRectangle.jsx';
import NavLeft from '../../../components/nav_left/NavLeft.jsx';
import ConsumibleButton from '../ConsumibleButton.jsx';
import './GestionarConsumible.css';

function GestionarConsumible() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [consumible, setConsumible] = useState(null);

  useEffect(() => {
    if (location.state?.consumibleData) {
      setConsumible(location.state.consumibleData);
    } else {
      navigate('/gestionar-inventario'); 
    }
  }, [location.state, navigate]);

  const handleEditarCantidad = useCallback(() => {
    console.log('Editando cantidad...');
    Swal.fire({
      title: 'Editar Cantidad',
      input: 'number',
      inputValue: consumible?.cantidad || 0,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      background: '#FFFDEA',
      confirmButtonColor: '#FBD275', 
      cancelButtonColor: '#E989A4' 
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Nueva cantidad: ${result.value}`);
        // Update state or API call here
        setConsumible(prev => ({
          ...prev,
          cantidad: parseInt(result.value)
        }));
      }
    });
  }, [consumible]);

  const handleEliminarConsumible = useCallback(() => {
    console.log('Eliminando consumible...');
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar ${consumible?.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#FFFDEA',
      confirmButtonColor: '#FBD275', 
      cancelButtonColor: '#E989A4' 
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Consumible eliminado');
        // Handle deletion here
        navigate('/gestionar-inventario');
      }
    });
  }, [consumible, navigate]);

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
      label: 'Editar Cantidad',
      onClick: handleEditarCantidad,
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
                  label={consumible.name} 
                  onClick={() => {}} 
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
                    <p>{consumible.merma}</p>
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