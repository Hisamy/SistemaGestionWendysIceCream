import React from 'react';
import PropTypes from 'prop-types';
import ConsumibleButton from './ConsumibleButton.jsx';
import './ConsumiblesGrid.css'


const ConsumiblesGrid = ({ consumibles, onConsumibleClick, selectedId = null }) => {
  return (
    <div className="consumibles-grid">
      {consumibles.map((consumible) => (
        <ConsumibleButton
          key={consumible.id}
          label={consumible.name}
          onClick={() => onConsumibleClick(consumible.id)}
          selected={selectedId === consumible.id}
        />
      ))}
    </div>
  );
};

ConsumiblesGrid.propTypes = {
  consumibles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onConsumibleClick: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ConsumiblesGrid;