import PropTypes from 'prop-types';
import './PinkRectangle.css';

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

PinkRectangle.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  searchable: PropTypes.bool
};

export default PinkRectangle;