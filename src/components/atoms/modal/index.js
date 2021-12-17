import React from "react";
import { Modal } from "@teamfabric/copilot-ui";

const DynamicModal = (props) => {
  const {
    heading,
    height,
    width,
    size,
    isCancelButton,
    isConfirmButton,
    confirmButtonText,
    onCancel,
    onConfirm,
    renderModalContent,
    className = "",
    isCustomSize = false,
  } = props;

  const footerButtons = [];

  if (isCancelButton) {
    footerButtons.push({
      isPrimary: false,
      onClick: onCancel,
      text: "Cancel",
    });
  }
  if (isConfirmButton) {
    footerButtons.push({
      isPrimary: true,
      onClick: onConfirm,
      text: confirmButtonText || "Save",
    });
  }
  return (
    <Modal
      className={className}
      headerText={heading}
      headerButtons={[]}
      height={height || "150px"}
      onBackdropClick={onCancel}
      onClose={onCancel}
      padding="20px 40px 20px 40px"
      render={renderModalContent}
      showCloseButton
      size={!isCustomSize ? size || "small" : ""}
      width={width || "200px"}
      footerButtons={footerButtons}
    />
  );
};

export default DynamicModal;
