import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ label, onClick, className }) => {
    
    Button.propTypes = {
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        className: PropTypes.string,
    };

    return (
        <button className={`global-button ${className}`} onClick={onClick}>
            {label}
        </button>
    );
}

export default Button;
