import React from 'react';
import PropTypes from 'prop-types';
import ConsumibleButton from '../../../gestionar_inventario/ConsumibleButton';
import AmountConsumibleButton from '../../../../components/main_content/AmountConsumibleButton.jsx';
import './ElegirConsumibleGrid.css'



const ElegirConsumiblesGrid = ({ consumibles }) => {
  return (
    <div className="elegir-consumibles-grid">
      {consumibles.map((consumible) => (
        <div className='elegir-consumible-container'>
            <ConsumibleButton
                key={consumible.id}
                label={consumible.name}
            />
            <AmountConsumibleButton/>
        </div>
        

      ))}
    </div>
  );
};

ElegirConsumiblesGrid.propTypes = {
  consumibles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onConsumibleClick: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ElegirConsumiblesGrid;