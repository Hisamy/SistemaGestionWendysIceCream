import React from 'react';
import PropTypes from 'prop-types';
import ProductoButton from './ProductoButton.jsx';



const ProductosGrid = ({ productos, onProductosClick, selectedId = null }) => {
  return (
    <div className="productos-grid">
      {productos.map((producto) => (
        <ProductoButton
          key={producto.id}
          label={producto.name}
          image={producto.image}
          onClick={() => onProductosClick(producto)} 
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
    })
  ).isRequired,
  onProductosClick: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ProductosGrid;