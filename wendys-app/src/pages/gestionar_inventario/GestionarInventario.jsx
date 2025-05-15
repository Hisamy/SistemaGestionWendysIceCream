import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import ConsumiblesGrid from './ConsumiblesGrid.jsx';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import inventarioController from '../../controllers/InventarioController.js';


/**
 * @module GestionarInventario
 * @description Componente funcional para la gestión del inventario de consumibles.
 * Permite al usuario seleccionar un consumible para ver sus detalles y gestionarlo,
 * registrar nuevos consumibles y generar reportes del inventario.
 * Utiliza React Hooks para la gestión del estado y efectos secundarios, y React Router para la navegación.
 *
 * @requires react
 * @requires react-router-dom
 * @requires components/NavLeft
 * @requires components/PinkRectangle
 * @requires components/ConsumiblesGrid
 * @requires ./GestionarInventario.css
 */
function GestionarInventario() {

  const navigate = useNavigate();

  /**
   * Estado local para almacenar el ID del consumible actualmente seleccionado en la grid.
   * @state {number | null} selectedConsumible
   * @default null
   */
  const [selectedConsumible, setSelectedConsumible] = useState(null);

  /**
   * Estado local para almacenar la lista de consumibles obtenida del backend.
   * @state {Array<object>} consumibles
   * @default []
   */
  const [consumibles, setConsumibles] = useState([]);

  /**
   * Estado local para indicar si la carga de los consumibles está en curso.
   * @state {boolean} loading
   * @default true
   */
  const [loading, setLoading] = useState(true);

  /**
   * Estado local para almacenar cualquier error ocurrido durante la carga de los consumibles.
   * @state {string | null} error
   * @default null
   */
  const [error, setError] = useState(null);

  /**
   * Hook de efecto que se ejecuta al montar el componente.
   * Su función es cargar la lista de consumibles desde el backend a través de `inventarioController.obtenerConsumibles()`.
   * Mapea la respuesta para extraer el ID y el nombre de cada consumible y actualiza el estado `consumibles`.
   * También gestiona los estados `loading` y `error` según el resultado de la llamada a la API.
   * @useEffect
   * @async
   */
  useEffect(() => {
    const cargarConsumibles = async () => {
      try {
        // Asumiendo que 'inventarioController' está disponible en el scope
        const data = await inventarioController.obtenerConsumibles();
        const consumiblesMapeados = data.map(item => ({
          id: item.id,
          name: item.nombre
        }));
        setConsumibles(consumiblesMapeados);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar consumibles:", error);
        setError("Error al cargar los consumibles. Por favor, intenta de nuevo.");
        setLoading(false);
      }
    };
    cargarConsumibles();
  }, []);

  /**
   * Función memoizada para manejar el clic en un consumible de la grid.
   * Actualiza el estado `selectedConsumible` con el ID del consumible seleccionado
   * y navega a la página de gestión de consumibles (`/gestionar-consumible`),
   * pasando el ID del consumible a través del estado de la ruta.
   * @function handleConsumibleClick
   * @param {object} consumible - El objeto del consumible que fue clickeado.
   * @param {number} consumible.id - El ID del consumible.
   * @dependency {function} navigate
   */
  const handleConsumibleClick = useCallback((consumible) => {
    setSelectedConsumible(consumible.id);
    navigate('/gestionar-consumible', { state: { id: consumible.id } });
  }, [navigate]);

  /**
   * Función memoizada para manejar el clic en el botón de registrar un nuevo consumible.
   * Navega a la página de registro de consumibles (`/registrar-consumible`).
   * @function handleRegistrarConsumible
   * @dependency {function} navigate
   */
  const handleRegistrarConsumible = useCallback(() => {
    console.log('Registrando consumible...');
    navigate('/registrar-consumible');
  }, [navigate]);

  /**
   * Función memoizada para manejar el clic en el botón de generar reporte.
   * Actualmente solo loguea un mensaje en la consola. En una implementación real,
   * aquí se implementaría la lógica para generar y descargar un reporte del inventario.
   * @function handleGenerarReporte
   */
  const handleGenerarReporte = useCallback(() => {
    console.log('Generando reporte...');
  }, []);

  /**
   * Array de objetos que define los botones para el componente `NavLeft`.
   * Cada objeto especifica la etiqueta del botón, la función a ejecutar al hacer clic y la variante de estilo.
   * @constant {Array<Object>} buttons
   */
  const buttons = [
    {
      label: 'Registrar Consumible',
      onClick: handleRegistrarConsumible,
      variant: 'primary'
    },
    {
      label: 'Generar Reporte',
      onClick: handleGenerarReporte,
      variant: 'secondary'
    }
  ];

  /**
   * Renderizado del componente `GestionarInventario`.
   * Muestra una navegación izquierda con los botones para registrar consumibles y generar reportes,
   * y un área de contenido principal dentro de un `PinkRectangle`.
   * Si los consumibles están cargando, se muestra un mensaje de carga.
   * Si ocurre un error durante la carga, se muestra un mensaje de error.
   * De lo contrario, se muestra el componente `ConsumiblesGrid` para la visualización y selección de los consumibles.
   * @returns {JSX.Element}
   */
  return (
    <div className="container">
      <div className='nav-left'>
        <NavLeft
          instruction="Selecciona el consumible a gestionar."
          buttons={buttons}
        />
      </div>
      <div className="fit-parent">
        <div className="content">
          <PinkRectangle searchable={true}>
            {loading ? (
              <div className="loading-message">Cargando consumibles...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <ConsumiblesGrid
                consumibles={consumibles}
                onConsumibleClick={handleConsumibleClick}
                selectedId={selectedConsumible}
              />
            )}
          </PinkRectangle>
        </div>
      </div>
    </div>
  );
}

export default GestionarInventario;