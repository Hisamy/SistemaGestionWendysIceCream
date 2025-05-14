import React from 'react';
import PropTypes from 'prop-types';

/**
 * @component
 * @description Un botón de acción reutilizable con diferentes variantes de estilo y funcionalidad de deshabilitado.
 */
const ActionButton = ({ children, onClick, variant = 'primary', disabled = false }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`action-button ${variant} ${disabled ? 'disabled' : ''}`}
    >
      {children}
    </button>
  );
};

/**
 * @propTypes
 * @type {object}
 * @property {React.ReactNode} children - El contenido que se mostrará dentro del botón (texto, iconos, etc.). Requerido.
 * @property {function} onClick - La función que se ejecutará cuando se haga clic en el botón. Si el botón está deshabilitado, esta función no se llamará. Requerido.
 * @property {('primary'|'secondary')} [variant='primary'] - La variante de estilo del botón.
 * Puede ser 'primary' (estilo principal) o 'secondary' (estilo secundario). Por defecto es 'primary'.
 * @property {boolean} [disabled=false] - Un valor booleano que indica si el botón está deshabilitado.
 * Si es `true`, el botón no responderá a los clics y tendrá un estilo visual diferente. Por defecto es `false`.
 */
ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  disabled: PropTypes.bool
};

export default ActionButton;