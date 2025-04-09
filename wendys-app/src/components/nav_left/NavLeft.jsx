import NavButton from './NavButton';
import PropTypes from 'prop-types';
import './NavLeft.css'; 

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