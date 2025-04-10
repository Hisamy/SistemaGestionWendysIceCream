import React, { createContext, useState, useContext } from 'react';
import Swal from 'sweetalert2';


const ProductosVentaContext = createContext();


export const ProductosVentaProvider = ({ children }) => {
    const [productosVenta, setProductosVenta] = useState([]);

    // Agregar un producto a la lista
    const addProducto = (producto, detalles) => {
    const idVenta = Date.now();

    setProductosVenta(prevProductos => [
        ...prevProductos,
        {
          idVenta,
          producto,
          detalles,

          precioFinal: calculatePrecioFinal(producto, detalles)
        }
      ]);
    };

    // Calcular precio según los detalles seleccionados
    const calculatePrecioFinal = (producto, detalles) => {
    let precio = producto.price;
    
    //Es un ejemplo
    // Ajustar precio según tamaño
    if (detalles.tamano === 'Mediano') {
      precio = precio * 1.25; // 25% más
    } else if (detalles.tamano === 'Grande') {
      precio = precio * 1.5; // 50% más
    }
    
    return precio;
    };

    // Eliminar un producto de la lista
    const deleteProducto = (idVenta) => {
        setProductosVenta(productosVenta.filter(item => item.idVenta !== idVenta));
    };

    const calculateCambio = (dineroRecibido) => {
      const total = calculateTotal();
      const dineroNumerico = typeof dineroRecibido === 'string' 
          ? parseFloat(dineroRecibido) 
          : dineroRecibido;
      
      if (isNaN(dineroNumerico)) {
          return 0;
      }
      
      const cambio = dineroNumerico - total;
      return cambio > 0 ? cambio : 0;
  };

    // Limpiar la lista completa
    const cleanProductos = () => {
      setProductosVenta([]);
    };

    // Calcular el total de la venta
  const calculateTotal = () => {
    return productosVenta.reduce((total, item) => total + item.precioFinal, 0);
  };

  return (
    <ProductosVentaContext.Provider 
      value={{ 
        productosVenta, 
        addProducto, 
        deleteProducto, 
        cleanProductos,
        calculateTotal,
        calculateCambio,
        hayProductos: productosVenta.length > 0
      }}
    >
      {children}
    </ProductosVentaContext.Provider>
  );

  
};

export const useProductosVenta = () => {
  const context = useContext(ProductosVentaContext);
  if (!context) {
    throw new Error('useProductosVenta debe usarse dentro de un ProductosVentaProvider');
  }
  return context;
};
