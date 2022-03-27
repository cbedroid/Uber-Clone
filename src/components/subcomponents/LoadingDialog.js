import React from "react";
import { PropTypes } from "prop-types";
import { Dialog } from "react-native-elements";

const LoadingDialog = (props) => {
  return (
    <Dialog isVisible={props?.isVisible}>
      <Dialog.Loading size="large" />
    </Dialog>
  );
};

export default LoadingDialog;
LoadingDialog.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};
