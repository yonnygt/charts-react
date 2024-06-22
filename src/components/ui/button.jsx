// components/ui/button.jsx
import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ type, children, onClick, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={` px-4 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white text-center bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']).isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  onClick: null,
  className: '',
};

export default Button;
