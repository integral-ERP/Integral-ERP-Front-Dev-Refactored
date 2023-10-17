import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "../../../styles/components/ModalForms.scss"

const ModalForm = ({ children, isOpen, closeModal }) => {
  const [modalDimensions, setModalDimensions] = useState({ width: 'auto', height: 'auto' });

  const handleModalContainerClick = (e) => e.stopPropagation();

  useEffect(() => {
    const updateModalDimensions = () => {
      const container = document.querySelector('.modal__container');
      // if (container) {
      //   setModalDimensions({
      //     width: `${container.scrollWidth}px`,
      //     height: `${container.scrollHeight}px`,
      //   });
      // }
    };

    if (isOpen) {
      updateModalDimensions();
      window.addEventListener('resize', updateModalDimensions);
    }

    return () => {
      window.removeEventListener('resize', updateModalDimensions);
    };
  }, [isOpen]);

  return (
    <article className={`modal-form ${isOpen && 'is-open'}`} onClick={closeModal}>
      <div
        className="modal__container" 
        // style={{ width: modalDimensions.width, height: modalDimensions.height }}
        onClick={handleModalContainerClick}
      >
        <button className="modal__close" onClick={closeModal}>
          X
        </button>
        {children}
      </div>
    </article>
  );
};

ModalForm.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
};

ModalForm.defaultProps = {
  children: null,
  isOpen: false,
  closeModal: () => {},
};

export default ModalForm;
