import React, { useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import { PropTypes } from "prop-types";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

// eslint-disable-next-line react/display-name
const AnimatedIcon = React.forwardRef((props, ref) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: props?.isHidden ? 0 : 1,
      duration: props?.isHidden ? 0 : 700,
      useNativeDriver: true,
    }).start();
  });

  return (
    <Animated.View ref={ref} style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={() => props.handleClearInput()}>
        <Icon style={tw`${props.hidden && "hidden"} text-red-400 p-1 px-2`} {...props} />
      </TouchableOpacity>
    </Animated.View>
  );
});

export default AnimatedIcon;
Animated.prototypes = {
  isHidden: PropTypes.bool.isRequired,
  handleClearInput: PropTypes.func.isRequired,
};
