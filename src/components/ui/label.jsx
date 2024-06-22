// components/ui/label.jsx
import React from 'react';
import PropTypes from 'prop-types';

export const Label = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700  mb-1 ${className}`}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Label;
