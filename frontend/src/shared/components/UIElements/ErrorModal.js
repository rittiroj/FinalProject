import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';
import './ErrorModal.css'

const ErrorModal = props => {

  // const onClear = () => {
  //   props.onClear

  // }

  return (
    <Modal
      onCancel={props.onClear}
      header="พบข้อผิดพลาด!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>
        <a href="/">ตกลง</a>
      </Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
