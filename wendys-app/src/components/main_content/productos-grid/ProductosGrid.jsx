import './ProductosGrid.css'
import PropTypes from 'prop-types';
import ProductoButton from './ProductoButton';

const ProductosGrid = ({ productos, onProductoClick, selectedId = null }) => {
  return (
    <div className="productos-grid">
      {productos.map((producto) => (
        <ProductoButton
          key={producto.id}
          label={producto.name}
          image={producto.image}
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
        onProductoClick={onProductoClick} // Ahora coherente
        selectedId={selectedId}
      />
      {children}
    </PinkRectangle>
  );
}

export default ProductosGrid;