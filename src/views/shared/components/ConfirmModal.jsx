import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({  onHide, onConfirm, title, body }) {
    console.log('ConfirmModal render');

  return (
    <Modal show={true}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: '100%' }}>{body}</Modal.Body>
      <Modal.Footer>
        <Button style={{ color: 'red' }} variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
