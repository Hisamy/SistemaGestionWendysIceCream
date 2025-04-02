import PropTypes from 'prop-types';
import './ConsumibleButton.css'

const ConsumibleButton = ({ label, onClick, selected = false }) => {
    return (
        <button
            onClick={onClick}
            className={`consumible-button ${selected ? 'selected' : ''}`}
        >
            {label}
        </button>
    );
};

ConsumibleButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool
};

export default ConsumibleButton;