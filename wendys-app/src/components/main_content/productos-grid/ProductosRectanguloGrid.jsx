import React from 'react';
import PropTypes from 'prop-types';
import PinkRectangle from '../PinkRectangle.jsx';
import ProductosGrid from './ProductosGrid.jsx';

function ProductosRectanguloGrid({
  productos,
  onProductoClick,
  selectedId,
  searchable = true,
  children
}) {
  return (
    <PinkRectangle searchable={searchable}>
      {productos.length === 0 ? (
        <p>No hay productos aún</p>
      ) : (
        <>
          <ProductosGrid
            productos={productos}
            onProductoClick={onProductoClick}
            selectedId={selectedId}
          />
          {children}
        </>
      )}
    </PinkRectangle>
  );
}

ProductosRectanguloGrid.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
      imagenPath: PropTypes.string
    })
  ).isRequired,
  onProductoClick: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  searchable: PropTypes.bool,
  children: PropTypes.node
};

export default ProductosRectanguloGrid;