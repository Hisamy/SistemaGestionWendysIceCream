import React from "react";
import {useProductosVenta} from '../../pages/registrar_venta/registrar-venta-contexto.jsx';
import './Ticket.module.css';

const Ticket = ({ fecha = new Date() }) => {
    const { productosVenta, calculateTotal } = useProductosVenta();
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };
    
    const formatDate = (date) => {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit', 
            minute: '2-digit'
        };
        return new Intl.DateTimeFormat('es-MX', options).format(date);
    };
    
    const total = calculateTotal();
    
    return (
        <div className="ticket">
            <div className="ticket-header">
                <img
                    src="/path/to/your/logo.png"
                    alt="Logo"
                    className="ticket-logo"
                />
                <p className="ticket-title">Mi Tienda</p>
                <p className="ticket-info">
                    Dirección de la Tienda<br/>
                    Tel: 555-555-5555<br/>
                    {formatDate(fecha)}
                </p>
            </div>
            
            <div className="ticket-divider"></div>
            
            <table className="ticket-table">
                <thead>
                    <tr>
                        <th className="producto">PRODUCTO</th>
                        <th className="precio">PRECIO</th>
                    </tr>
                </thead>
                <tbody>
                    {productosVenta.map((item) => (
                        <tr key={item.idVenta}>
                            <td>{item.producto.name}</td>
                            <td className="precio-valor">{formatPrice(item.producto.price)}</td>     
                        </tr>                                 
                    ))}
                </tbody>
            </table>
            
            <div className="ticket-divider"></div>
            
            <div className="ticket-total">
                <span>TOTAL:</span>
                <span className="total-valor">{formatPrice(total)}</span>
            </div>
            
            <p className="ticket-footer">
                ¡Gracias por su compra!<br/>
                Vuelva pronto
            </p>
        </div>
    );
};

export default Ticket;