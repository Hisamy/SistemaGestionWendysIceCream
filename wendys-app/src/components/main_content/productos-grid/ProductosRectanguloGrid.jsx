import React from 'react';
import PropTypes from 'prop-types';
import PinkRectangle from '../PinkRectangle.jsx';
import ProductosGrid from './ProductosGrid.jsx';

/**
 * @component
 * @description Muestra una cuadrícula de productos dentro de un contenedor `PinkRectangle`.
 * Permite mostrar un mensaje si no hay productos y renderiza el componente `ProductosGrid`.
 * También acepta un prop `searchable` para controlar si el `PinkRectangle` debe tener funcionalidades de búsqueda
 * y un prop `children` para renderizar contenido adicional dentro del contenedor.
 */
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

/**
 * @propTypes
 * @type {object}
 * @property {Array<Object>} productos - Un array de objetos que representan los productos a mostrar.
 * Cada objeto debe tener las siguientes propiedades:
 * - `id`: Un identificador único del producto (string o número). Requerido.
 * - `nombre`: El nombre del producto (string). Requerido.
 * - `imagenPath`: La ruta relativa de la imagen del producto (string).
 * Este array se pasa directamente al componente `ProductosGrid`. Requerido.
 * @property {function} onProductoClick - La función que se llamará cuando se haga clic en un producto dentro de la `ProductosGrid`.
 * Se pasa directamente al componente `ProductosGrid`. Requerido.
 * @property {string|number} [selectedId] - El ID del producto que debe aparecer como seleccionado en la `ProductosGrid`.
 * Se pasa directamente al componente `ProductosGrid`. Opcional.
 * @property {boolean} [searchable=true] - Un booleano que indica si el contenedor `PinkRectangle` debe tener funcionalidades de búsqueda.
 * Por defecto es `true`.
 * @property {React.ReactNode} [children] - Elementos hijos que se renderizarán después de la `ProductosGrid` dentro del `PinkRectangle`. Opcional.
 */
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