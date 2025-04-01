import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

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

NavButton.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  path: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger'])
};

export default NavButton;