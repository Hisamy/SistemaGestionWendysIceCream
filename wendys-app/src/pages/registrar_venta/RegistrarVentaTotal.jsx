import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import { useProductosVenta } from './registrar-venta-contexto/ProductosVentaContext.jsx';
import Swal from 'sweetalert2';
import './RegistrarVentaTotal.css'
import ventaController from '../../controllers/VentaController.js';
import TicketService from '../../controllers/generarTicket/TicketService.js';

/**
 * @module RegistrarVentaTotal
 * @description Componente funcional para mostrar el total de la venta, recibir el dinero del cliente,
 * calcular el cambio y confirmar la venta. Utiliza un hook personalizado (`useProductosVenta`)
 * para acceder a los productos en venta y funciones relacionadas. También interactúa con un
 * servicio (`TicketService`) para la generación de tickets.
 *
 * @requires react
 * @requires react-router-dom
 * @requires sweetalert2
 * @requires components/NavLeft
 * @requires components/PinkRectangle
 * @requires hooks/useProductosVenta
 * @requires services/TicketService
 * @requires ./RegistrarVentaTotal.css
 */
function RegistrarVentaTotal() {
    /**
     * Hook de React Router para obtener la función `navigate`, que permite la navegación programática entre rutas.
     * @constant {function} navigate
     */
    const navigate = useNavigate();

    /**
     * Hook personalizado que proporciona el estado de los productos en venta y funciones relacionadas
     * como calcular el total, limpiar los productos y calcular el cambio.
     * @constant {object} productosVentaContext
     * @property {Array<object>} productosVenta - Array de productos en la venta actual.
     * @property {function} calculateTotal - Función para calcular el total de la venta.
     * @property {function} cleanProductos - Función para limpiar el carrito de productos.
     * @property {function} calculateCambio - Función para calcular el cambio a devolver al cliente.
     */
    const { productosVenta, calculateTotal, cleanProductos, calculateCambio } = useProductosVenta();

    /**
     * Estado local para almacenar la cantidad de dinero recibido del cliente.
     * @state {string} dineroRecibido
     * @default ""
     */
    const [dineroRecibido, setDineroRecibido] = useState("");

    /**
     * Estado local para almacenar el cambio calculado a devolver al cliente.
     * @state {number} cambioCalculado
     * @default 0
     */
    const [cambioCalculado, setCambioCalculado] = useState(0);

    /**
     * Estado local para indicar si la operación de confirmación de venta está en curso.
     * Se utiliza para deshabilitar los botones durante el procesamiento.
     * @state {boolean} isLoading
     * @default false
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Función para formatear un número a la representación de precio en pesos mexicanos (MXN).
     * @function formatPrice
     * @param {number} price - El precio a formatear.
     * @returns {string} - El precio formateado como moneda MXN.
     */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    /**
     * Manejador de eventos para el cambio en el input de dinero recibido.
     * Actualiza el estado `dineroRecibido` con el nuevo valor del input.
     * @function handleDineroRecibidoChange
     * @param {object} e - El evento de cambio del input.
     */
    const handleDineroRecibidoChange = (e) => {
        setDineroRecibido(e.target.value);
    };

    /**
     * Manejador de eventos para la tecla presionada en el input de dinero recibido.
     * Si la tecla presionada es 'Enter', calcula el cambio utilizando la función `calculateCambio`
     * y actualiza el estado `cambioCalculado`.
     * @function handleKeyDown
     * @param {object} e - El evento de teclado del input.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const cambio = calculateCambio(dineroRecibido);
            setCambioCalculado(cambio);
        }
    };

    /**
     * Manejador de eventos para el clic en el botón "Atrás".
     * Navega de regreso a la página de registro de venta (`/registrar-venta`).
     * @function handleAtrasClick
     */
    const handleAtrasClick = () => {
        navigate('/registrar-venta');
    };

    /**
     * Manejador de eventos para el clic en el botón "Cancelar Pedido".
     * Muestra una confirmación al usuario utilizando SweetAlert2 antes de cancelar la venta.
     * Si el usuario confirma, limpia el carrito de productos y navega de regreso a la página de registro de venta.
     * @function handleCancelarVenta
     */
    const handleCancelarVenta = () => {
        Swal.fire({
            icon: 'warning',
            title: '¡Cancelar venta!',
            text: '¿Desea cancelar esta venta?',
            confirmButtonColor: 'rgb(251, 210, 117)',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                cleanProductos();
                navigate('/registrar-venta');
            }
        });
    };

    /**
     * Función para preparar los datos de los productos en venta para ser enviados a la API.
     * Mapea el array `productosVenta` al formato esperado por el backend, incluyendo
     * el nombre del producto, ID de la variante, precio, tamaño (si existe) y notas (si existen).
     * @function prepararDatosVenta
     * @returns {Array<object>} - Array de objetos con la información de cada producto en el formato de la API.
     */
    const prepararDatosVenta = () => {
        return productosVenta.map(item => ({
            nombre: item.producto.name,
            idVariante: item.producto.varianteId,
            precio: item.producto.price,
            tamanio: item.detalles?.tamano || "UNICO",
            notas: item.detalles?.notas || ""
        }));
    };

    /**
     * Función asíncrona para generar y (opcionalmente) descargar o imprimir el ticket de venta.
     * Utiliza el servicio `TicketService` para realizar esta acción.
     * Muestra mensajes de éxito o error al usuario utilizando SweetAlert2.
     * @async
     * @function handleImprimirTicket
     */
    const handleImprimirTicket = () => {
        try {
            const total = calculateTotal();

            // Usar el servicio para generar y descargar el ticket
            TicketService.downloadTicket(productosVenta, total);
            // Opcionalmente, también se puede abrir el diálogo de impresión:
            // ticketService.printTicket(productosVenta, total);

            Swal.fire({
                icon: 'success',
                title: 'Ticket generado',
                text: 'El ticket se ha generado correctamente.',
                confirmButtonColor: 'rgb(251, 210, 117)',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            console.error('Error al generar el ticket:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al generar el ticket. Por favor, inténtelo de nuevo.',
                confirmButtonColor: 'rgb(251, 210, 117)',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    /**
     * Función asíncrona para confirmar la venta registrándola en el backend.
     * Prepara los datos de la venta, realiza una llamada a la API (`ventaController.registrarVenta`),
     * y muestra mensajes de éxito o error al usuario utilizando SweetAlert2.
     * En caso de éxito, pregunta si desea imprimir el ticket y luego limpia el carrito y navega a la página de registro de venta.
     * @async
     * @function handleConfirmarVenta
     */
    const handleConfirmarVenta = async () => {
        try {
            setIsLoading(true);

            // Preparar los datos para enviar a la API
            const datosVenta = prepararDatosVenta();

            // Si no hay productos, mostrar error
            if (datosVenta.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No hay productos en la venta',
                    confirmButtonColor: 'rgb(251, 210, 117)',
                    confirmButtonText: 'Aceptar'
                });
                setIsLoading(false);
                return;
            }

            // Llamar a la API para registrar la venta
            const response = await ventaController.registrarVenta(datosVenta);

            // Si la respuesta es exitosa, mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Venta confirmada!',
                text: 'La venta se ha registrado con éxito.',
                confirmButtonColor: 'rgb(251, 210, 117)',
                confirmButtonText: 'Imprimir ticket'
            }).then((result) => {
                if (result.isConfirmed) {
                    handleImprimirTicket();
                }
                cleanProductos();
                navigate('/registrar-venta');
            });

        } catch (error) {
            console.error('Error al registrar la venta:', error);

            // Mostrar mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al registrar la venta. Por favor, inténtelo de nuevo.',
                confirmButtonColor: 'rgb(251, 210, 117)',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Array de objetos que define los botones para el componente `NavLeft`.
     * Cada objeto especifica la etiqueta del botón, la función a ejecutar al hacer clic, la variante de estilo
     * y si el botón debe estar deshabilitado (en caso de carga).
     * @constant {Array<Object>} navLeftButtons
     */
    const navLeftButtons = [
        {
            label: 'Atrás',
            onClick: handleAtrasClick,
            variant: 'primary',
        },
        {
            label: isLoading ? 'Procesando...' : 'Confirmar Venta',
            onClick: handleConfirmarVenta,
            variant: 'primary',
            disabled: isLoading
        },
        {
            label: 'Cancelar Pedido',
            onClick: handleCancelarVenta,
            variant: 'primary',
            disabled: isLoading
        }
    ];

    /**
     * Renderizado condicional en caso de que no haya productos seleccionados para la venta.
     * Muestra un mensaje informativo y un botón para volver a la página de registro de venta.
     * @returns {JSX.Element | null}
     */
    if (!productosVenta || productosVenta.length === 0) {
        return (
            <div className="container">
                <div className='nav-left'>
                    <NavLeft
                        instruction="No hay productos seleccionados."
                        buttons={[{
                            label: 'Volver',
                            onClick: handleAtrasClick,
                            variant: 'primary',
                        }]}
                    />
                </div>
                <div className="fit-parent">
                    <div className="content">
                        <PinkRectangle>
                            <div className="mensaje-vacio">
                                <h2>No hay productos en la venta</h2>
                                <p>Vuelve a la pantalla anterior para agregar productos.</p>
                            </div>
                        </PinkRectangle>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Calcula el total de la venta utilizando la función `calculateTotal` del hook `useProductosVenta`.
     * @constant {number} total
     */
    const total = calculateTotal();

    /**
     * Renderizado principal del componente `RegistrarVentaTotal`.
     * Muestra la navegación izquierda con los botones de acción, y un área de contenido principal
     * dentro de un `PinkRectangle` que lista los productos en la venta, muestra el total,
     * permite ingresar el dinero recibido y muestra el cambio calculado.
     * @returns {JSX.Element}
     */
    return (
        <div className="container">
            <div className='nav-left'>
                <NavLeft
                    instruction="Total."
                    buttons={navLeftButtons}
                />
            </div>
            <div className="fit-parent">
                <div className="content">
                    <PinkRectangle>
                        <div className='productos-costo'>
                            <div className="header-productos-costo">
                                <h3>Productos</h3>
                                <h3>Costo</h3>
                            </div>
                            <div className='productos'>
                                {productosVenta.map((item) => (
                                    <div
                                        className='producto'
                                        key={item.idVenta}
                                    >
                                        <p>{item.producto.nombre}</p>
                                        <p className='price-product'>{formatPrice(item.producto.price)}</p>
                                    </div>
                                ))}
                            </div>
                            <hr
                                className='separador-venta-total'
                            />
                            <div className='recibido-total'>
                                <div className='total-container'>
                                    <p>Dinero recibido</p>
                                    <div className="input-container">
                                        <input
                                            type="number"
                                            value={dineroRecibido}
                                            onChange={handleDineroRecibidoChange}
                                            onKeyDown={handleKeyDown}
                                            className="dinero-recibido-input"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className='total-container'>
                                    <p>Total</p>
                                    <p className='total-text'>{formatPrice(total)}</p>
                                </div>
                            </div>
                            <hr
                                className='separador-venta-total'
                            />
                            <div className='cambio-cliente'>
                                <p>Cambio</p>
                                <p className='cambio'>{formatPrice(cambioCalculado)}</p>
                            </div>
                        </div>
                    </PinkRectangle>
                </div>
            </div>
        </div>
    );
}
export default RegistrarVentaTotal;
export const datosTicket = () => {


}