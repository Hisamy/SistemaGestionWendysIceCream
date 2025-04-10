import { useProductosVenta } from '../registrar-venta-contexto/ProductosVentaContext.jsx'
import React, {useState, useCallback, useEffect } from 'react';
import iconoEliminar from '../../../assets/Images/iconoEliminar.png';

import './MostrarProductosVenta.css'



const MostrarProductosVenta = () => {
    const {productosVenta, deleteProducto, calculateTotal} = useProductosVenta();
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const handleEliminarProducto = (idVenta) => {
        deleteProducto(idVenta);
    }

    const total = calculateTotal();
        
        return (
            <div className='container-productos-venta'>
                <div className='header-productos-venta '>
                    <h3>PRODUCTOS</h3>
                    <h3>PRECIO</h3>
                </div>
                <div className='productos-venta'>
                    {productosVenta.map((item) => (
                        <div className='producto-venta-container'>
                            <div className='producto-venta'>
                                <div className='name-producto'>
                                    <p>{item.producto.name}</p>
                                </div>
                                
                                <p className='price-product'>{formatPrice(item.producto.price)}</p>
                            </div>
                            <div className='button-eliminar-container'> 
                                <img
                                src={iconoEliminar}
                                alt="Eliminar producto" 
                                className='button-eliminar'
                                onClick={() => handleEliminarProducto(item.idVenta)}/>
                            </div>
                        </div>
                    ))}
                </div>
                <hr/>
                <div className='recibido-total-venta'>
                    <p>TOTAL</p>
                    <p className='total-text'>{formatPrice(total)}</p>
                </div>
            </div>
            );




}

export default MostrarProductosVenta;