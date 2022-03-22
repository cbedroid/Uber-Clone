import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { PropTypes } from "prop-types";
import tw from "tailwind-react-native-classnames";

// eslint-disable-next-line react/display-name
const VerificationInputs = React.forwardRef((props, ref) => {
  const [textFocus, setTextFocus] = useState(false);

  return (
    <View style={tw``}>
      <TextInput
        ref={ref}
        style={tw`mx-2 text-lg text-gray-600 text-center border-b-2 pb-1 w-10 ${textFocus ? "border-gray-600" : "border-gray-300"}`}
        keyboardType="numeric"
        maxLength={1}
        onFocus={() => setTextFocus(true)}
        onBlur={() => setTextFocus(false)}
        blurOnSubmit={false}
        searchIcon={false}
        onChangeText={(input) => props.handleChange(input, props.inputIndex)}
      />
    </View>
  );
});

export default VerificationInputs;

VerificationInputs.propTypes = {
  handleChange: PropTypes.func.isRequired,
  inputIndex: PropTypes.number.isRequired,
};
