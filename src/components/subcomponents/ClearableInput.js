import React, { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native";
import { PropTypes } from "prop-types";
import tw from "tailwind-react-native-classnames";
import AnimatedIcon from "./AnimatedIcon";

// eslint-disable-next-line react/display-name
const ClearableInput = React.forwardRef((props, ref) => {
  const [focused, setFocus] = useState(false);

  const handleChangeText = (input) => {
    props.setValue(input || null);
  };

  return (
    <View style={tw`flex-row items-center content-between border-b-4 ${focused ? "bg-gray-100" : "bg-gray-50"} pb-1 ${props?.containerStyle}`}>
      <TextInput
        ref={ref}
        onChangeText={handleChangeText}
        blurOnSubmit={false}
        placeholder={props.placeholder || "name@example.com"}
        searchIcon={false}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onSubmitEditing={props.handleSubmit}
        maxLength={40}
        style={tw`flex-1  text-xl text-gray-600  mr-3`}
        {...props}
      />
      <AnimatedIcon isHidden={!props.value} handleClearInput={() => props.setValue(null)} type="font-awesome" name="close" size={16} color="#c3c3c3" />
    </View>
  );
});

export default ClearableInput;

ClearableInput.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};
