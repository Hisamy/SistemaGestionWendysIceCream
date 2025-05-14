
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

/**
 * @component
 * @description Un elemento individual de la barra de navegación, que utiliza `NavLink` para la gestión de rutas activas.
 */
const NavigationItem = ({ path, label }) => (
  <li className="nav-item">
    <NavLink
      to={path}
      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
    >
      {label}
    </NavLink>
  </li>
);

/**
 * @propTypes
 * @type {object}
 * @property {string} path - La ruta a la que enlaza este elemento de navegación. Este prop es requerido.
 * @property {string} label - El texto que se mostrará en el enlace de navegación. Este prop es requerido.
 */
NavigationItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default NavigationItem;