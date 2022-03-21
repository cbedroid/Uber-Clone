import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import { PropTypes } from "prop-types";
import { Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { setUser } from "../features/userSlice";
import { humanPhoneNumber } from "../Helper";
import VerificationInputs from "./subcomponents/VerificationInputs";

const PhoneVerification = (props) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState([...Array(4)]);
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
    if (!value.replace(/[^\d]/g, "")) return;

    const next = index < 4 ? index + 1 : index;
    const prev = 0 < index < 4 ? index - 1 : index;

    let _code = code;
    _code[index] = value || null;

    const nextInput = value ? next : prev;
    const input = codeRefs?.current[nextInput];
    input?.focus();
    setCode(_code);
  };

  const handleSubmit = () => {
    // Parse code array into a String
    let parsedCode = "";
    code.forEach((val) => {
      parsedCode += val.toString();
    });

    // Dispatch phone verification status to redux
    const codeValid = parsedCode.length === 4;
    if (!codeValid) setErrorMessage("Invalid verification code");
    dispatch(setUser({ phoneNumberVerified: codeValid }));
  };

  return (
    <View style={tw`flex-1`}>
      <Text style={tw`text-lg text-gray-600`}>Enter the 4-digit code sent to you at +{humanPhoneNumber(props.phoneNumber)}</Text>
      <View style={tw`flex flex-row my-8`}>
        {[...Array(4)].map((__, index) => (
          <VerificationInputs ref={addToRef} key={index} inputIndex={index} handleChange={handleInputCode} />
        ))}
      </View>
      <Text style={tw`text-red-600 ${errorMessage && "py-2"}`}>{errorMessage}</Text>
      <Text style={[tw`text-gray-500 font-bold`, { fontFamily: "VisbySemibold" }]}>Resend code in 00:15</Text>
      <Button onPress={handleSubmit} containerStyle={tw`mt-auto `} buttonStyle={tw`bg-black h-14 w-full p-3`} title="Next" color="#000" iconRight />
    </View>
  );
};

export default PhoneVerification;

PhoneVerification.propTypes = {
  phoneNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.number]),
};
