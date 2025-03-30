import PropTypes from 'prop-types';

function Consumible(props) {
    return (
        <div className="consumible">
            <p>{props.nombre}</p>
        </div>
    );
}

Consumible.propTypes = {
    nombre: PropTypes.string,
};


export default Consumible;