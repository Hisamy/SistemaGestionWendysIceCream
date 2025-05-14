import { memo } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import logo from '/src/assets/Images/logo.png';
import NavigationItem from './NavigationItem';
import './Header.css';

/**
 * @component
 * @description Encabezado principal de la aplicación, que contiene el logo y la navegación principal.
 */
const Header = ({ logoAlt = 'logo' }) => {
  /**
   * @constant
   * @type {Array<Object>}
   * @description Array de objetos que define los elementos de navegación.
   * Cada objeto tiene las propiedades `path` (la ruta a la que enlaza el elemento)
   * y `label` (el texto que se muestra en el enlace).
   */
  const navigationItems = [
    { path: '/', label: 'Inicio' },
    { path: '/gestionar-producto', label: 'Gestionar Producto' },
    { path: '/registrar-venta', label: 'Registrar venta' },
    { path: '/gestionar-inventario', label: 'Gestionar inventario' },
    { path: '/gestionar-venta', label: 'Gestionar venta' }
  ];

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

/**
 * @propTypes
 * @type {object}
 * @property {string} [logoAlt='logo'] - Texto alternativo para la imagen del logo por accesibilidad.
 * Si no se proporciona, el valor por defecto es 'logo'.
 */
Header.propTypes = {
  logoAlt: PropTypes.string
};

export default memo(Header);