import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import { PropTypes } from "prop-types";
import { Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import VerificationInputs from "../../components/subcomponents/VerificationInputs";
import { setUser } from "../../features/userSlice";
import { humanPhoneNumber } from "../../Helper";
const _ = require("lodash");

// TODO: Remove VerificationInputs and use ClearableInput

const PhoneVerificationScreen = ({ navigation }, props) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState([...Array(4)]);
  const [isDisabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const codeRefs = useRef([]);
  codeRefs.current = [];

  /**
   * Dynamically create refs for code input
   * @param {*} el
   */
  const addToRef = (el) => {
    if (el && !codeRefs.current.includes(el)) {
      codeRefs.current.push(el);
    }
  };

  const handleInputCode = (value, index) => {
    const next = index < 4 ? index + 1 : index;
    const prev = 0 > index < 4 ? index - 1 : index;

    let _code = code;
    _code[index] = value || null;

    const nextInput = value ? next : prev;
    const input = codeRefs?.current[nextInput];
    input?.focus();

    setCode(_code);
    const is_disabled = _.compact(code, _.indentity).length !== 4;
    setDisabled(is_disabled);
  };

  const handleSubmit = () => {
    // Parse code array into a String
    let parsedCode = "";
    code.forEach((val) => {
      parsedCode += `${val || ""}`.replace(/[^\d]/g, "");
    });

    // Dispatch phone verification status to redux
    const codeValid = parsedCode.length === 4;
    if (!codeValid) {
      setErrorMessage("Invalid verification code");
      return;
    }
    /* dispatch user action to redux will trigger AccountRegisterScreen to remount
     * and set the current account setup set
     * See - AccountRegisterScreen `mode`
     */
    dispatch(setUser({ phoneNumberVerified: codeValid }));
    navigation.navigate("EmailRegisterScreen");
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Text style={tw`text-lg text-gray-600`}>Enter the 4-digit code sent to you at {humanPhoneNumber(props.phoneNumber)}</Text>
      <View style={tw`flex flex-row my-8`}>
        {[...Array(4)].map((__, index) => (
          <VerificationInputs ref={addToRef} key={index} inputIndex={index} handleChange={handleInputCode} />
        ))}
      </View>
      <Text style={tw`text-red-600 ${errorMessage && "py-2"}`}>{errorMessage}</Text>
      <Text style={[tw`text-gray-500 font-bold`, { fontFamily: "VisbySemibold" }]}>Resend code in 00:15</Text>
      <Button
        disabled={isDisabled}
        onPress={handleSubmit}
        containerStyle={tw`mt-auto `}
        buttonStyle={tw`bg-black h-14 w-full p-3`}
        title="Next"
        color="#000"
        iconRight
      />
    </View>
  );
};

export default PhoneVerificationScreen;

PhoneVerificationScreen.propTypes = {
  phoneNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
