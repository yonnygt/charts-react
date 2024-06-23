// components/ui/label.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../ui/ThemeContext'; 

export const Label = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium dark:text-gray-50  mb-1 ${className} `}
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
