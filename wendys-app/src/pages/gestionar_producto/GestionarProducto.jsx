import React, { useState, useCallback, useEffect } from 'react';
import NavLeft from '../../components/nav_left/NavLeft.jsx';
import ProductosRectanguloGrid from '../../components/main_content/productos-grid/ProductosRectanguloGrid.jsx';
import { useNavigate } from 'react-router-dom';
import productoController from '../../controllers/ProductoController.js';

/**
 * @module GestionarProducto
 * @description Componente funcional para la gestión de productos.
 * Permite al usuario seleccionar un producto para editarlo y registrar nuevos productos.
 * Utiliza React Hooks para la gestión del estado y efectos secundarios, y React Router para la navegación.
 *
 * @requires react
 * @requires react-router-dom
 * @requires components/NavLeft
 * @requires components/ProductosRectanguloGrid
 * @requires ./GestionarProducto.css
 */
function GestionarProducto() {

  const navigate = useNavigate();

  /**
   * Estado local para almacenar el ID del producto actualmente seleccionado en la grid.
   * @state {number | null} selectedProducto
   * @default null
   */
  const [selectedProducto, setSelectedProducto] = useState(null);

  /**
   * Estado local para almacenar la lista de productos obtenida del backend.
   * @state {Array<object>} productos
   * @default []
   */
  const [productos, setProductos] = useState([]);

  /**
   * Hook de efecto que se ejecuta al montar el componente.
   * Su función es cargar la lista de productos desde el backend a través de `productoController.obtenerProductos()`.
   * Actualiza el estado `productos` con la respuesta de la API.
   * Maneja los posibles errores durante la carga de los productos.
   * @useEffect
   * @async
   */
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Asumiendo que 'productoController' está disponible en el scope
        const productosEncontrados = await productoController.obtenerProductos();
        setProductos(productosEncontrados);
      } catch (error) {
        console.error("Error fetching productos:", error);
        // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
      }
    };
    fetchProductos();
  }, []);

  /**
   * Función memoizada para manejar el clic en un producto de la grid.
   * Actualiza el estado `selectedProducto` con el objeto del producto seleccionado
   * y navega a la página de edición de productos (`/editar-producto`),
   * pasando los datos del producto a través del estado de la ruta.
   * @function handleProductoClick
   * @param {object} producto - El objeto del producto que fue clickeado.
   * @dependency {function} navigate
   */
  const handleProductoClick = useCallback((producto) => {
    setSelectedProducto(producto);
    navigate('/editar-producto', { state: { productoData: producto } });
  }, [navigate]);

  /**
   * Función memoizada para manejar el clic en el botón de registrar un nuevo producto.
   * Navega a la página de registro de productos (`/registrar-producto`).
   * @function handleRegistrarProducto
   * @dependency {function} navigate
   */
  const handleRegistrarProducto = useCallback(() => {
    console.log('Registrando producto...');
    navigate('/registrar-producto');
  }, [navigate]);

  /**
   * Array de objetos que define los botones para el componente `NavLeft`.
   * Cada objeto especifica la etiqueta del botón, la función a ejecutar al hacer clic y la variante de estilo.
   * @constant {Array<Object>} navLeftButtons
   */
  const navLeftButtons = [
    {
      label: 'Registrar Producto',
      onClick: handleRegistrarProducto,
      variant: 'primary'
    },
  ];

  /**
   * Renderizado del componente `GestionarProducto`.
   * Muestra una navegación izquierda con el botón para registrar productos,
   * y un área de contenido principal que contiene el componente `ProductosRectanguloGrid`
   * para la visualización y selección de los productos.
   * @returns {JSX.Element}
   */
  return (
    <div className="container">
      <div className='nav-left'>
        <NavLeft
          instruction="Selecciona producto que se desee gestionar."
          buttons={navLeftButtons}
        />
      </div>
      <div className="fit-parent">
        <div className="content">
          <ProductosRectanguloGrid
            productos={productos}
            onProductoClick={handleProductoClick}
            selectedId={selectedProducto?.id}
            searchable={true}
          />
        </div>
      </div>
    </div>
  );
}

export default GestionarProducto;