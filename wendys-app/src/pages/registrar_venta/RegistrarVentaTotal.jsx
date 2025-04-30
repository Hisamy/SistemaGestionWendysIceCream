import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import { useProductosVenta } from './registrar-venta-contexto/ProductosVentaContext.jsx';
import Swal from 'sweetalert2';
import './RegistrarVentaTotal.css'
import ventaController from '../../controllers/VentaController.js';


function RegistrarVentaTotal(){
    const navigate = useNavigate();
    const { productosVenta, calculateTotal, cleanProductos, calculateCambio } = useProductosVenta();
    const [dineroRecibido, setDineroRecibido] = useState("");
    const [cambioCalculado, setCambioCalculado] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const handleDineroRecibidoChange = (e) => {
        setDineroRecibido(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const cambio = calculateCambio(dineroRecibido);
            setCambioCalculado(cambio);
        }
    };

    const handleAtrasClick = () => {
        navigate('/registrar-venta');
    };

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

    // Función para preparar los datos para la API
    const prepararDatosVenta = () => {
        // Transformar productosVenta al formato esperado por la API
        return productosVenta.map(item => ({
            nombre: item.producto.name,           // Nombre del producto
            idVariante: item.producto.varianteId, // ID de la variante
            precio: item.producto.price,          // Precio de la variante
            tamanio: item.detalles?.tamano || "UNICO", // Tamaño de la variante
            notas: item.detalles?.notas || ""     // Notas específicas
        }));
    };
    
    const handleImprimirTicket = () => {
      try {
          const total = calculateTotal();
          
          // Usar el servicio para generar y descargar el ticket
          ticketService.downloadTicket(productosVenta, total);
          
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
            confirmButtonText: 'Imprimir ticket',
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            cancelButtonColor: '#d33'
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

    const total = calculateTotal();
    
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
                                key={item.idVenta}>
                                    <p>{item.producto.name}</p>
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