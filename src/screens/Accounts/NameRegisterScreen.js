import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import BackButton from "../../components/BackButton";
import ClearableInput from "../../components/subcomponents/ClearableInput.js";
import { setUser } from "../../features/userSlice";

// TODO: Add username field to the form
const NameRegisterScreen = ({ navigation }) => {
  const inputRef_1 = useRef();
  const inputRef_2 = useRef();
  const [value_1, setValue_1] = useState(null);
  const [value_2, setValue_2] = useState(null);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    if (!value_1 || !value_2) return;
    const trimmedValue_1 = value_1.trim();
    const trimmedValue_2 = value_2.trim();
    const isValid = validateName(trimmedValue_1) && validateName(trimmedValue_2);
    if (!isValid) return;
    dispatch(setUser({ firstName: trimmedValue_1, lastName: trimmedValue_2 }));
    navigation.navigate("EmailPasswordScreen");
  };

  const validateName = (value) => {
    if (!value) return;

    const inValidCharacters = value.replace(/[\w_]/g, "").length > 0;
    const inValidLength = value.length < 3;
    if (inValidLength) setErrorMessage("Please enter a validate name.");
    else if (inValidCharacters) setErrorMessage("Name should only contain alphabets, number, or '_' characters.");

    return !inValidLength && !inValidCharacters;
  };

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <BackButton />
      <Text style={tw`text-gray-500 text-xl`}>What&apos;s your name?</Text>
      <View style={tw`flex flex-row mt-6 justify-between`}>
        <ClearableInput
          ref={inputRef_1}
          placeholder="First"
          handleSubmit={handleSubmit}
          containerStyle="w-36 p-2"
          onChange={(e) => setDisabled(e?.nativeEvent?.text.length === 0)}
          setValue={setValue_1}
          value={value_1}
        />
        <ClearableInput
          ref={inputRef_2}
          placeholder="Last"
          handleSubmit={handleSubmit}
          containerStyle="w-36 p-2"
          onChange={(e) => setDisabled(e?.nativeEvent?.text.length === 0)}
          setValue={setValue_2}
          value={value_2}
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

export default NameRegisterScreen;
