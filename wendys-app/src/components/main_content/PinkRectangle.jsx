import PropTypes from 'prop-types';
import './PinkRectangle.css';

/**
 * @component
 * @description Un contenedor rectangular con un estilo distintivo (rosa),
 * que opcionalmente puede incluir una barra de búsqueda y un título.
 * El contenido principal se renderiza dentro de un contenedor con scroll.
 */
const PinkRectangle = ({ children, title, searchable = false }) => {
  return (
    <div className="pink-rectangle">
      {/* Barra de búsqueda condicional */}
      {searchable && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar"
            className="search-input"
          />
        </div>
      )}

      {/* Título opcional */}
      {title && (
        <h2 className="rectangle-title">{title}</h2>
      )}

      {/* Contenedor con scroll para el contenido */}
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

/**
 * @propTypes
 * @type {object}
 * @property {React.ReactNode} children - El contenido que se renderizará dentro del rectángulo. Requerido.
 * @property {string} [title] - Un título opcional que se mostrará en la parte superior del rectángulo.
 * @property {boolean} [searchable=false] - Un booleano que determina si se debe mostrar una barra de búsqueda en la parte superior. Por defecto es `false`.
 */
PinkRectangle.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  searchable: PropTypes.bool
};

export default PinkRectangle;