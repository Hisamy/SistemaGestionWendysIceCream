import { memo } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import logo from '/src/assets/Images/logo.png';
import NavigationItem from './NavigationItem';
import './Header.css'; 

const navigationItems = [
  { path: '/gestionar-producto', label: 'Gestionar Producto' },
  { path: '/registrar-venta', label: 'Registrar venta' },
  { path: '/gestionar-inventario', label: 'Gestionar inventario' },
  { path: '/gestionar-venta', label: 'Gestionar venta' }
];

const Header = ({ logoAlt = 'logo' }) => {
  return (
    <header className="header">
      <div className="header-brand">
        <NavLink to="/">
          <img className="header-logo" src={logo} alt={logoAlt} />
        </NavLink>
      </div>
      <nav className="header-nav">
        <ul className="header-nav-list">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.path}
              path={item.path}
              label={item.label}
            />
          ))}
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  logoAlt: PropTypes.string
};

export default memo(Header);