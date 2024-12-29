import React from "react";
import Modal from "react-modal";
import "./CustomModal.css";

const CustomModal = ({
  isOpen,
  onAfterOpen,
  onRequestClose,
  contentLabel,
  className,
  children,
}) => {
  return (
    <Modal
      className={className}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
