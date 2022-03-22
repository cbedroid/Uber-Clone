import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { SecretKey } from "@env";
import bcrypt from "bcryptjs";
import * as SecureStore from "expo-secure-store";
import { Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import ClearableInput from "../../components/subcomponents/ClearableInput.js";
import { setUser } from "../../features/userSlice";

const SetPasswordScreen = ({ navigation }) => {
  const passwordRef = useRef();
  const email = useSelector((state) => state.user.user?.email);
  const [value, setValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setDisabled] = useState(true);

  const dispatch = useDispatch();

  const saveEncryptedPassword = async () => {
    // Encrypt password
    // docs: https://www.npmjs.com/package/bcryptjs
    const key = email.trim().replace(/[^\w]/g, "");
    const hashPassword = await bcrypt.hashSync(value.trim(), SecretKey);

    // dispatch password to redux and expo secureStore
    dispatch(setUser({ password: hashPassword }));
    await SecureStore.setItemAsync(key, hashPassword);
  };

  const validatePassword = () => {
    const validCharacters = value.replace(/[^\s]/g, "").length === 0;
    const validLength = value.length >= 8;
    if (!validCharacters) setErrorMessage("Password can not contain spaces.");
    else if (!validLength) setErrorMessage("Password too short. Password must be at least 8 characters.");
    return validLength && validCharacters;
  };

  const handleSubmit = async () => {
    console.log("Handing Main Submission");
    if (!value || !email) alert("Invalid email or password");
    if (!validatePassword()) return;
    console.log("Submitting Secured value");
    await saveEncryptedPassword();
    navigation.navigate("NameRegisterScreen");
  };

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <Text style={tw`text-gray-500 text-xl`}>Create your account password</Text>
      <View style={tw`mt-6`}>
        <ClearableInput
          ref={passwordRef}
          placeholder="Enter your password"
          handleSubmit={handleSubmit}
          onChange={(e) => setDisabled(e?.nativeEvent?.text.length === 0)}
          setValue={setValue}
          value={value}
          secureTextEntry={true}
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

export default SetPasswordScreen;
