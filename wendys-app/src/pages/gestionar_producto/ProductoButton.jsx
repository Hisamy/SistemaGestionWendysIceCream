import PropTypes from 'prop-types';
import './ProductoButton.css'

const ProductoButton = ({ label, onClick, image ,selected = false }) => {
    return (
        <div>
            <button
            onClick={onClick}
            className={`producto-button ${selected ? 'selected' : ''}`}>
                <img src={image} alt={label}/>
            </button>
            <p>{label}</p>
        </div>
        
    );
};

ProductoButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    image: PropTypes.string,
};

export default ProductoButton;