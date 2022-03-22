import React from "react";
import { StyleSheet, View } from "react-native";
import { PropTypes } from "prop-types";

const BoxShadow = (props) => {
  const boxShadowStyles = StyleSheet.create({
    boxShadow: {
      borderBottomWidth: 1,
      borderBottomColor: "transparent",
      shadowColor: props.color,
      shadowOffset: { width: 0, height: props.height },
      shadowOpacity: props.opacity,
      shadowRadius: 3.85,
      elevation: 12,
    },
  });

  return <View style={{ ...boxShadowStyles?.boxShadow }}></View>;
};

export default BoxShadow;
BoxShadow.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  opacity: PropTypes.float,
};
BoxShadow.defaultProps = {
  color: "#1c1c1c",
  height: 2,
  opacity: 0.75,
};
