import NavLeft from "../../../../components/nav_left/NavLeft";
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import PinkRectangle from "../../../../components/main_content/PinkRectangle";
import ElegirConsumiblesGrid from "./ElegirConsumibleGrid";
import inventarioController from '../../../../controllers/InventarioController.js';

/**
 * @module ElegirConsumibles
 * @description Componente funcional que permite al usuario seleccionar los consumibles a utilizar
 * en una variante específica de un producto. Recibe el índice de la variante y la lista de
 * consumibles actuales a través del estado de la ubicación (`location.state`).
 * Permite modificar la cantidad de cada consumible y guarda las selecciones al hacer clic en "Aceptar".
 * Utiliza React Hooks para la gestión del estado y efectos secundarios, y React Router para la navegación.
 *
 * @requires react
 * @requires react-router-dom
 * @requires components/NavLeft
 * @requires components/PinkRectangle
 * @requires components/ElegirConsumiblesGrid
 * @requires ./ElegirConsumibles.css
 */
function ElegirConsumibles() {
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Extrae el índice de la variante (`variantIndex`) y la lista de consumibles actuales (`consumiblesActuales`)
     * del estado de la ubicación. Si el estado no está definido, se utiliza un array vacío por defecto para `consumiblesActuales`.
     * @constant {number | undefined} variantIndex
     * @constant {Array<object>} consumiblesActuales
     */
    const { variantIndex, consumiblesActuales = [] } = location.state || {};

    /**
     * Estado local para almacenar las cantidades seleccionadas de cada consumible.
     * Se inicializa a partir de los `consumiblesActuales` para mantener las selecciones previas.
     * La clave del objeto es el ID del consumible y el valor es la cantidad seleccionada.
     * @state {object} consumiblesSeleccionados
     * @default Inicializado a partir de `consumiblesActuales`.
     */
    const [consumiblesSeleccionados, setConsumiblesSeleccionados] = useState(() => {
        const inicial = {};
        consumiblesActuales.forEach(c => {
            inicial[c.id] = c.cantidad;
        });
        return inicial;
    });

    /**
     * Estado local para almacenar la lista de todos los consumibles disponibles.
     * Se espera que esta lista sea obtenida desde el backend.
     * @state {Array<object>} consumibles
     * @default []
     */
    const [consumibles, setConsumibles] = useState([]);

    /**
     * Hook de efecto que se ejecuta cuando el valor de `consumiblesActuales` cambia.
     * Su función es actualizar el estado `consumiblesSeleccionados` con las cantidades de los
     * consumibles actuales, asegurándose de que los IDs sean tratados como números.
     * @useEffect
     * @dependency {Array<object>} consumiblesActuales
     */
    useEffect(() => {
        const nuevosSeleccionados = {};
        (consumiblesActuales || []).forEach(c => {
            const id = typeof c.id === 'string' ? parseInt(c.id, 10) : c.id;
            nuevosSeleccionados[id] = c.cantidad;
        });
        setConsumiblesSeleccionados(nuevosSeleccionados);
    }, [consumiblesActuales]);

    /**
     * Hook de efecto que se ejecuta al montar el componente.
     * Su función es realizar una llamada asíncrona para obtener la lista de todos los consumibles
     * disponibles desde el backend (a través de `inventarioController.obtenerConsumibles()`)
     * y actualizar el estado `consumibles` con la respuesta.
     * @useEffect
     * @async
     */
    useEffect(() => {
        const fetchConsumibles = async () => {
            try {
                // Asumiendo que 'inventarioController' está disponible en el scope
                const consumiblesEncontrados = await inventarioController.obtenerConsumibles();
                setConsumibles(consumiblesEncontrados);
            } catch (error) {
                console.error("Error fetching consumibles:", error);
            }
        };
        fetchConsumibles();
    }, []);

    /**
     * Manejador de eventos para el cambio en la cantidad de un consumible específico.
     * Actualiza el estado `consumiblesSeleccionados` con la nueva cantidad, asegurándose
     * de que la cantidad no sea menor a cero.
     * @function handleCantidadChange
     * @param {number} id - ID del consumible cuya cantidad ha cambiado.
     * @param {number} cantidad - Nueva cantidad del consumible.
     */
    const handleCantidadChange = (id, cantidad) => {
        setConsumiblesSeleccionados(prev => ({
            ...prev,
            [id]: Math.max(0, cantidad)
        }));
    };

    /**
     * Manejador de eventos para el clic en el botón "Aceptar".
     * Filtra los consumibles seleccionados para incluir solo aquellos con una cantidad mayor que cero.
     * Luego, mapea estos consumibles a un formato adecuado para ser enviados de vuelta a la página anterior
     * y navega de regreso, pasando el índice de la variante y la lista de consumibles actualizados a través del estado de la ruta.
     * Se incluye la opción `preserveState: true` para intentar preservar el estado de la página anterior (puede no funcionar en todos los casos).
     * @function handleAceptar
     */
    const handleAceptar = () => {
        const consumiblesParaVariante = Object.entries(consumiblesSeleccionados)
            .filter(([_, cantidad]) => cantidad > 0)
            .map(([id, cantidad]) => ({
                id: parseInt(id),
                cantidad: parseInt(cantidad)
            }));

        // Navegar enviando los consumibles actualizados
        navigate('/registrar-producto', {
            state: {
                variantIndex,
                consumibles: consumiblesParaVariante,
                preserveState: true
            }
        });
    };

    /**
     * Manejador de eventos para el clic en el botón "Cancelar".
     * Navega de regreso a la página de registro de producto sin guardar los cambios en los consumibles.
     * @function handleCancelar
     */
    const handleCancelar = () => {
        navigate('/registrar-producto');
    };

    /**
     * Array de objetos que define los botones para el componente `NavLeft`.
     * Cada objeto especifica la etiqueta del botón, la función a ejecutar al hacer clic y la variante de estilo.
     * @constant {Array<Object>} navLeftButtons
     */
    const navLeftButtons = [
        {
            label: 'Aceptar',
            onClick: handleAceptar,
            variant: 'primary'
        },
        {
            label: 'Cancelar',
            onClick: handleCancelar,
            variant: 'primary'
        },
    ];

    /**
     * Renderizado del componente `ElegirConsumibles`.
     * Muestra una navegación izquierda con los botones "Aceptar" y "Cancelar",
     * y un área de contenido principal dentro de un `PinkRectangle` que contiene el componente
     * `ElegirConsumiblesGrid` para la visualización y selección de los consumibles.
     * @returns {JSX.Element}
     */
    return (
        <div className="container">
            <div className="nav-left">
                <NavLeft
                    instruction="Selecciona los consumibles a utilizar en el producto."
                    buttons={navLeftButtons}
                />
            </div>
            <div className="fit-parent">
                <div className="content">
                    <div className="elegir-consumible-content">
                        <PinkRectangle searchable={true}>
                            <ElegirConsumiblesGrid
                                consumibles={consumibles}
                                cantidades={consumiblesSeleccionados}
                                onCantidadChange={handleCantidadChange}
                            />
                        </PinkRectangle>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ElegirConsumibles;