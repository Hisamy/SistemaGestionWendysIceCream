import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

/**
 * @component
 * @description Un botón de navegación reutilizable que puede ser un enlace (`NavLink`)
 * si se proporciona una ruta (`path`), o un botón normal (`<button>`) con una función `onClick`.
 * Permite incluir un icono y tiene diferentes variantes de estilo.
 */
const NavButton = ({ icon, label, onClick, path, variant = 'primary' }) => {
  const buttonClassName = `nav-button nav-button-${variant}`;

  if (path) {
    return (
      <NavLink to={path} className={buttonClassName}>
        {icon && <span className="nav-button-icon">{icon}</span>}
        <span className="nav-button-label">{label}</span>
      </NavLink>
    );
  }

  return (
    <button
      className={buttonClassName}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="nav-button-icon">{icon}</span>}
      <span className="nav-button-label">{label}</span>
    </button>
  );
};

/**
 * @propTypes
 * @type {object}
 * @property {React.ReactNode} [icon] - Un elemento de React (como un icono SVG o de fuente) que se mostrará a la izquierda de la etiqueta. Opcional.
 * @property {string} label - El texto que se mostrará en el botón. Requerido.
 * @property {function} [onClick] - La función que se ejecutará cuando se haga clic en el botón (solo si no se proporciona `path`). Opcional.
 * @property {string} [path] - La ruta a la que enlazará el botón (convirtiéndolo en un `NavLink`). Si se proporciona, la prop `onClick` se ignora. Opcional.
 * @property {('primary'|'secondary'|'danger')} [variant='primary'] - La variante de estilo del botón.
 * Puede ser 'primary' (estilo principal), 'secondary' (estilo secundario) o 'danger' (estilo de advertencia/peligro). Por defecto es 'primary'.
 */
NavButton.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  path: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger'])
};

export default NavButton;