import React from 'react';
import PropTypes from 'prop-types';


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

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  disabled: PropTypes.bool
};

export default ActionButton;