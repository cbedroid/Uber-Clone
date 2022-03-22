import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import ClearableInput from "../../components/subcomponents/ClearableInput.js";
import { setUser } from "../../features/userSlice";

const EmailRegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [isDisabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const emailRef = useRef();

  const handleSubmit = () => {
    if (!email) return;
    const isValid = validateEmailAddress();
    if (!isValid) return;
    dispatch(setUser({ email: email.trim() }));
    navigation.navigate("SetPasswordScreen");
  };
  const validateEmailAddress = () => {
    console.log("validating Email");
    const emailFormat = new RegExp(/(\w{4,}(?!\s).*@(?!\s).*\.\w*)/g);
    const isValid = emailFormat.test(email || "");
    if (!isValid) setErrorMessage("Please enter a valid email address.");

    return isValid;
  };

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <Text style={tw`text-gray-500 text-xl`}>What&apos;s your email address?</Text>
      <View style={tw`mt-6`}>
        <ClearableInput
          ref={emailRef}
          placeholder="name@example.com"
          handleSubmit={handleSubmit}
          onChange={(e) => setDisabled(e?.nativeEvent?.text.length === 0)}
          setValue={setEmail}
          value={email}
        />
      </View>
      <Text style={tw`text-red-600 ${errorMessage && "py-2"}`}>{errorMessage}</Text>
      <View style={tw`mt-auto mb-4`}>
        <Button
          disabled={isDisabled}
          onPress={() => handleSubmit()}
          containerStyle={tw`mt-auto `}
          buttonStyle={tw`bg-black h-14 w-full p-3`}
          title="Next"
          color="#000"
          iconRight
        />
      </View>
    </View>
  );
};

export default EmailRegisterScreen;
