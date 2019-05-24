import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

import styles from './DeleteModal.module.sass';

const DeleteModal = (props) => {
  const { text, close, loading, action, actionText } = props;
  return (
    <div className={styles['modal']}>
      <Modal show={props.in} style={{marginTop: '8rem'}}>
        <Modal.Header style={{ textAlign: 'center' }}>
          <h5 style={{ padding: '0', margin: '0 auto', textAlign: 'center'}}>{text}</h5>
        </Modal.Header>
        <Modal.Body style={{ padding: '1rem', textAlign: 'center' }}>
          <Button variant="primary" onClick={close}>No, cancel</Button>
          <Button variant="secondary" onClick={loading ? null : action}>{!loading ? actionText : <Spinner size="sm" animation="border" />}</Button>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DeleteModal
