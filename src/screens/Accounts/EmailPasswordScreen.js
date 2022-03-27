import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import BackButton from "../../components/BackButton";
import ClearableInput from "../../components/subcomponents/ClearableInput.js";
import { useFirebase } from "../../contexts/FirebaseContext";
import { setUser, selectUser } from "../../features/userSlice";
import { auth } from "../../firebase";

const EmailPasswordScreen = ({ navigation }) => {
  const { sendVerificationEmail, updateUserProfile } = useFirebase();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const passwordRef = useRef();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isDisabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const emailRef = useRef();

  React.useEffect(() => console.clear(), []);
  // eslint-disable-next-line no-unused-vars
  const handleEmailVerification = React.useCallback(() => {
    navigation.navigate("HomeScreen");
  }, [emailVerified]);

  const handleSubmit = async () => {
    if (!email || !password) {
      return setErrorMessage("Please enter an Email and Password");
    }
    const isEmailValid = validateEmailAddress();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) return;

    dispatch(setUser({ email: email.trim() }));

    await signupUser();
  };

  const validateEmailAddress = () => {
    console.log("Validating Email");
    const emailFormat = new RegExp(/(\w{4,}(?!\s).*@(?!\s).*\.\w*)/g);
    const isValid = emailFormat.test(email || "");
    if (!isValid) setErrorMessage("Please enter a valid email address.");

    return isValid;
  };
  const validatePassword = () => {
    console.log("Validation password");
    const validCharacters = password.replace(/[^\s]/g, "").length === 0;
    const validLength = password.length >= 8;
    if (!validCharacters) setErrorMessage("Password can not contain spaces.");
    else if (!validLength) setErrorMessage("Password too short. Password must be at least 8 characters.");
    return validLength && validCharacters;
  };

  /**
   *  Creates user's firebase account
   */
  const signupUser = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      updateUserProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.userName || user.firstName,
        phoneNumber: user.phoneNumber,
      });

      // send verification email to user
      const onSuccessCallback = () => setEmailVerified(true);
      sendVerificationEmail(onSuccessCallback);
      // Alert user that verification email was sent

      // logout user so they will have reauthenticate before proceeding
      // auth.signOut();

      // Update the user global state
      dispatch(setUser({ uid: cred.uid, lastLoginAt: cred.lastLoginAt }));
      setTimeout(() => {
        navigation.navigate("EmailVerificationScreen");
      }, 800);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") setErrorMessage("That email address is already in use!");
      else if (error.code === "auth/invalid-email") setErrorMessage("That email address is invalid!");
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <BackButton />
      <Text style={tw`text-gray-400 text-2xl font-bold`}>Create your Account!</Text>
      <View style={tw`mt-6`}>
        <Text style={tw`text-gray-600 text-xl font-bold pb-2 `}>Email:</Text>
        <ClearableInput
          ref={emailRef}
          placeholder="name@example.com"
          handleSubmit={handleSubmit}
          onChange={(e) => setDisabled(e?.nativeEvent?.text.length === 0)}
          setValue={setEmail}
          value={email}
        />
      </View>
      <View style={tw`mt-12`}>
        <Text style={tw`text-gray-600 text-xl font-bold pb-2`}>Password:</Text>
        <ClearableInput
          ref={passwordRef}
          placeholder="Enter your password"
          handleSubmit={handleSubmit}
          onChange={(e) => setDisabled(e?.nativeEvent?.text.length === 0)}
          setValue={setPassword}
          value={password}
          securedText={true}
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

export default EmailPasswordScreen;
