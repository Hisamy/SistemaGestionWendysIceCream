import React from 'react';
import './ProductosGrid.css'
import PropTypes from 'prop-types';
import ProductoButton from './ProductoButton.jsx';
import { API_URL } from '../../../utils/api.js';

/**
 * @component
 * @description Muestra una cuadrícula de botones de productos.
 * Recibe una lista de productos y renderiza un `ProductoButton` para cada uno.
 * Permite seleccionar un producto y define una acción al hacer clic en un producto.
 */
const ProductosGrid = ({ productos, onProductoClick, selectedId = null }) => {
  return (
    <div className="productos-grid">
      {productos.map((producto) => (
        <ProductoButton
          key={producto.id}
          label={producto.nombre}
          image={API_URL + '/images/' + producto.imagenPath}
          onClick={() => onProductoClick(producto)}
          selected={selectedId === producto.id}
        />
      ))}
    </div>
  );
};

/**
 * @propTypes
 * @type {object}
 * @property {Array<Object>} productos - Un array de objetos que representan los productos a mostrar.
 * Cada objeto debe tener las siguientes propiedades:
 * - `id`: Un identificador único del producto (string o número). Requerido.
 * - `nombre`: El nombre del producto (string). Requerido.
 * - `imagenPath`: La ruta relativa de la imagen del producto (string).
 * @property {function} onProductoClick - La función que se llamará cuando se haga clic en un `ProductoButton`.
 * Recibe el objeto del producto como argumento. Requerido.
 * @property {string|number} [selectedId=null] - El ID del producto que debe aparecer como seleccionado.
 * Si coincide con el ID de un producto en la lista, su `ProductoButton` tendrá un estilo visual diferente. Opcional, por defecto es `null`.
 */
ProductosGrid.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string
    })
  ).isRequired,
  onProductoClick: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};


export default ProductosGrid;