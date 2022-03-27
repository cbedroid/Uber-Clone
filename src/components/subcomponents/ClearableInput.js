import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native";
import { PropTypes } from "prop-types";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import AnimatedIcon from "./AnimatedIcon";

// eslint-disable-next-line react/display-name
const ClearableInput = React.forwardRef((props, ref) => {
  const [focused, setFocus] = useState(false);
  const [isSecureText, setSecureText] = useState(false);

  useEffect(() => {
    setSecureText(props?.securedText);
  }, []);

  const handleChangeText = (input) => {
    input = input ? input.trim() : null;
    props.setValue(input);
  };

  return (
    <View
      style={tw`flex-row items-center content-between border-b-4 ${focused ? "bg-gray-100 border-black" : "bg-gray-50 border-gray-300"}  rounded-sm pb-1 px-2 ${
        props?.containerStyle
      }`}
    >
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
        secureTextEntry={isSecureText}
        style={tw`flex-1 text-xl text-gray-600 mr-3`}
        {...props}
      />
      {props.securedText && props.value && (
        <TouchableOpacity
          style={tw`mx-2`}
          onPressIn={() => {
            setSecureText(false);
          }}
          onPressOut={() => {
            setSecureText(true);
          }}
        >
          <Icon type="font-awesome-5" name={isSecureText ? "eye-slash" : "eye"} size={22} color="#333" />
        </TouchableOpacity>
      )}
      <AnimatedIcon isHidden={!props.value} handleClearInput={() => props.setValue(null)} type="font-awesome" name="close" size={16} color="#c3c3c3" />
    </View>
  );
});

export default ClearableInput;

ClearableInput.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  securedText: PropTypes.bool,
};
