import React from "react";

import { KeyboardAvoidingView, Platform } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import EmailPasswordScreen from "./EmailPasswordScreen";
import EmailVerificationScreen from "./EmailVerificationScreen";
import NameRegisterScreen from "./NameRegisterScreen";
import OTPVerificationScreen from "./OTPVerificationScreen";
import PhoneRegisterScreen from "./PhoneRegisterScreen";
import SignInScreen from "./SignInScreen";
import { AccountStackParams } from "./types";

const AccountRegisterScreen = () => {
  const AccountStack = createStackNavigator<AccountStackParams>();

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw` flex-1 bg-gray-50 my-6 px-6`}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
      >
        <AccountStack.Navigator initialRouteName="SignInScreen">
          <AccountStack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <AccountStack.Screen
            name="PhoneRegisterScreen"
            component={PhoneRegisterScreen}
            options={{ headerShown: false }}
          />
          <AccountStack.Screen
            name="OTPVerificationScreen"
            component={OTPVerificationScreen}
            options={{ headerShown: false }}
          />
          <AccountStack.Screen
            name="NameRegisterScreen"
            component={NameRegisterScreen}
            options={{ headerShown: false }}
          />
          <AccountStack.Screen
            name="EmailPasswordScreen"
            component={EmailPasswordScreen}
            options={{ headerShown: false }}
          />
          <AccountStack.Screen
            name="EmailVerificationScreen"
            component={EmailVerificationScreen}
            options={{ headerShown: false }}
          />
        </AccountStack.Navigator>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountRegisterScreen;
