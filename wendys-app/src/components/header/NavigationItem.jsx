
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

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

NavigationItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default NavigationItem;