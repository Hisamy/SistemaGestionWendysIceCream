import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import { useProductosVenta } from './registrar-venta-contexto/ProductosVentaContext.jsx';
import Swal from 'sweetalert2';
import './RegistrarVentaTotal.css'


function RegistrarVentaTotal(){
    const navigate = useNavigate();
    const { productosVenta, calculateTotal, cleanProductos, calculateCambio  } = useProductosVenta();
    const [dineroRecibido, setDineroRecibido] = useState("");
    const [cambioCalculado, setCambioCalculado] = useState(0);

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
        }).then(() => {
            cleanProductos();
            navigate('/registrar-venta');
        });
    };

    const handleConfirmarVenta = () => {
        Swal.fire({
            icon: 'success',
            title: '¡Venta confirmada!',
            text: 'La venta se ha registrado con éxito.',
            confirmButtonColor: 'rgb(251, 210, 117)',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            cleanProductos();
            navigate('/registrar-venta');
        });
    };

    const navLeftButtons = [
        {
            label: 'Atrás',
            onClick: handleAtrasClick,
            variant: 'primary',
        },
        {
            label: 'Confirmar Venta',
            onClick: handleConfirmarVenta,
            variant: 'primary',
        },
        {
            label: 'Cancelar Pedido',
            onClick: handleCancelarVenta,
            variant: 'primary',
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