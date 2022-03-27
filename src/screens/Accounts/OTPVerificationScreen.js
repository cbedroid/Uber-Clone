import React, { useState, useRef, useEffect } from "react";
import { View, Text } from "react-native";
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from "expo-firebase-recaptcha";
import { PhoneAuthProvider } from "firebase/auth";
import { Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import BackButton from "../../components/BackButton";
import VerificationInputs from "../../components/subcomponents/VerificationInputs";
import { useFirebase } from "../../contexts/FirebaseContext";
import { setUser, selectUser } from "../../features/userSlice";
import app from "../../firebase";
import { humanPhoneNumber } from "../../Helper";
const _ = require("lodash");

// TODO: Remove VerificationInputs and use ClearableInput

const OTPVerificationScreen = ({ navigation }, props) => {
  const CODE_LENGTH = 6;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const phoneNumber = user.phoneNumber;
  const { signInWithCredential, sendPhoneVerificationCode } = useFirebase();

  const [code, setCode] = useState([...Array(CODE_LENGTH)]);
  const [isDisabled, setDisabled] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState("red");
  const codeRefs = useRef([]);
  codeRefs.current = [];

  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = React.useState();

  const attemptInvisibleVerification = true;
  // If null, no SMS has been sent

  useEffect(() => {
    console.log("OTPVerificationScreen loaded");
    if (!phoneNumber) return handleMessage("Something went wrong. Phone number was not found", "red");
    sendVerificationCode();
  }, []);

  /**
   * Dynamically create refs for code input
   * @param {*} el
   */
  const addToRef = (el) => {
    if (el && !codeRefs.current.includes(el)) {
      codeRefs.current.push(el);
    }
  };

  const handleMessage = (message, color = "red") => {
    try {
      message = typeof message === "string" ? message : message.join("\n");
      setMessage(message);
    } catch {
      setMessage(`${message}`);
    }
    setMessageColor(color);
  };

  /**
   * Handles input change event
   *
   * @param {*} value  - input field value
   * @param {*} index  - index of focused input
   */
  const handleInputCode = (value, index) => {
    const next = index < CODE_LENGTH ? index + 1 : index;
    const prev = 0 > index < CODE_LENGTH ? index - 1 : index;

    let _code = code;
    _code[index] = value || null;

    const nextInput = value ? next : prev;
    const input = codeRefs?.current[nextInput];
    input?.focus();

    setCode(_code);
    const is_disabled = _.compact(code, _.indentity).length !== CODE_LENGTH;
    setDisabled(is_disabled);
  };

  /**
   * Validates verification code
   *
   */
  const handleSubmit = async () => {
    // Parse code array into a String
    let parsedCode = "";
    code.forEach((val) => {
      parsedCode += `${val || ""}`.replace(/[^\d]/g, "");
    });
    const codeValidLength = parsedCode.length === CODE_LENGTH;
    if (!codeValidLength) {
      handleMessage("Invalid verification code");
      return;
    }
    validateVerificationCode(parsedCode);
  };

  const validateVerificationCode = async (code) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const msg = "Phone verification was successful 👍";
      handleMessage(msg, "green");
      dispatch(setUser({ phoneNumberVerified: Boolean(credential) }));
      /**
       *  - Here we silently try to log in,user with current credentials, sign in user
       *
       *  - If user is signed In, it is assumed he/she already have a registered account,
       *    so we can bypass all other account registration and navigate user to HomeScreen
       */

      signInWithCredential(credential, () => navigation.navigate("HomeScreen"));
      // If signInWithCredential fails, then just continue the Account Registration process
      setTimeout(() => {
        navigation.navigate("NameRegisterScreen");
      }, 1000);
    } catch (err) {
      // TODO: Delay render next screen to give user time to read message
      handleMessage(`Error: ${err.message}`);
    }
  };

  const sendVerificationCode = async () => {
    const formattedNumber = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
    const onSuccess = (status) => setVerificationId(status);
    const onError = (error) => handleMessage(error);
    sendPhoneVerificationCode(formattedNumber, recaptchaVerifier.current, setVerificationId, onError);
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={app.options} />
      <BackButton />
      <Text style={tw`text-lg text-gray-600`}>
        Enter the {CODE_LENGTH}-digit code sent to you at {humanPhoneNumber(props.phoneNumber)}
      </Text>
      <View style={tw`flex flex-row my-8`}>
        {[...Array(6)].map((__, index) => (
          <VerificationInputs ref={addToRef} key={index} inputIndex={index} handleChange={handleInputCode} />
        ))}
      </View>
      <Text style={tw`text-${messageColor}-600 ${message && "py-2"}`}>{message}</Text>
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
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  );
};

export default OTPVerificationScreen;
