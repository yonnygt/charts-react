// components/ui/input.jsx
import React from 'react';
import PropTypes from 'prop-types';

export const Input = ({ id, type, value, onChange, placeholder, className }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500  dark:focus:ring-green-400 dark:focus:border-green-400 sm:text-sm  ${className}`}
    />
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

Input.defaultProps = {
  placeholder: '',
  className: '',
};

export default Input;
