import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import PhoneSetup from "../components/PhoneSetup";
import PhoneVerification from "../components/PhoneVerification";
import { selectUser } from "../features/userSlice";

const AccountRegisterScreen = () => {
  const [mode, setMode] = useState(1);
  const user = useSelector(selectUser);

  const setupStep = {
    PhoneSetup: 1,
    PhoneVerification: 2,
    EmailSetup: 3,
    PasswordSetup: 4,
    UserNameSetup: 5,
  };

  const renderScreen = React.useMemo(() => {
    // if (user?.phoneNumberVerified) console.log("Email screen");
    if (user?.phoneNumber) setMode(setupStep.PhoneVerification);

    switch (mode) {
      case setupStep.PhoneSetup:
        return <PhoneSetup />;
      case setupStep.PhoneVerification:
        return <PhoneVerification phoneNumber={user?.phoneNumber} />;
      default:
        return <PhoneSetup />;
    }
  }, [user]);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw` flex-1 bg-gray-50 my-12 px-6`}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
      >
        {renderScreen}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountRegisterScreen;

const styles = StyleSheet.create({});
