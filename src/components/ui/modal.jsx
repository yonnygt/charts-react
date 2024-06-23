import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ children, title, isOpen, onClose, onEdit, onDelete }) => {
  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action flex justify-end space-x-2">
          {onEdit && <button className="btn btn-success" onClick={onEdit}>Actualizar</button>}
          <button className="btn" onClick={onClose}>Cerrar</button>
          {onDelete && <button className="btn btn-error" onClick={onDelete}>Eliminar</button>}
        </div>
      </div>
    </dialog>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default Modal;
