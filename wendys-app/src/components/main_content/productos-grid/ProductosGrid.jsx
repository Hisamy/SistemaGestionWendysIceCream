import React from 'react';
import './ProductosGrid.css'
import PropTypes from 'prop-types';
import ProductoButton from './ProductoButton.jsx';
import { API_URL } from '../../../utils/api.js';

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