import NavButton from './NavButton';
import PropTypes from 'prop-types';
import './NavLeft.css';

/**
 * @component
 * @description Un contenedor para la navegación izquierda, que puede mostrar una instrucción
 * y una lista de botones de navegación (`NavButton`).
 */
const NavLeft = ({ instruction, buttons = [] }) => {
  return (
    <div className="nav-left-content">
      {instruction && (
        <div className="nav-instruction">
          <p>{instruction}</p>
        </div>
      )}

      {buttons.length > 0 && (
        <div className="nav-buttons">
          {buttons.map((button, index) => (
            <NavButton
              key={index}
              icon={button.icon}
              label={button.label}
              onClick={button.onClick}
              path={button.path}
              variant={button.variant || 'primary'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * @propTypes
 * @type {object}
 * @property {string} [instruction] - Un texto de instrucción opcional que se mostrará en la parte superior.
 * @property {Array<Object>} [buttons=[]] - Un array de objetos que definen los botones de navegación a renderizar.
 * Cada objeto puede tener las siguientes propiedades:
 * - `icon`: Un icono para el botón (opcional).
 * - `label`: El texto del botón (requerido).
 * - `onClick`: La función a ejecutar al hacer clic (opcional, solo si no hay `path`).
 * - `path`: La ruta para el `NavLink` (opcional, si está presente, `onClick` se ignora).
 * - `variant`: La variante de estilo del botón ('primary', 'secondary', 'danger', opcional, por defecto 'primary').
 * Por defecto, el array de botones está vacío.
 */
NavLeft.propTypes = {
  instruction: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      path: PropTypes.string,
      variant: PropTypes.oneOf(['primary', 'secondary', 'danger'])
    })
  )
};

export default NavLeft;