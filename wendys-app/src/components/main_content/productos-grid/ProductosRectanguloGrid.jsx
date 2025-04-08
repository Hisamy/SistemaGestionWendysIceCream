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
      <ProductosGrid
        productos={productos}
        onProductosClick={onProductoClick}
        selectedId={selectedId}
      />
      {children}
    </PinkRectangle>
  );
}

ProductosRectanguloGrid.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string
    })
  ).isRequired,
  onProductoClick: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  searchable: PropTypes.bool,
  children: PropTypes.node
};

export default ProductosRectanguloGrid;