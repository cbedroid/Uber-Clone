import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import { ACCOUNT_SCREENS } from "../../constants/accountConstants";
const AccountRegisterScreen = () => {
  const Stack = createStackNavigator();

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw` flex-1 bg-gray-50 my-6 px-6`}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
      >
        <Stack.Navigator initialRouteName="SignInScreen">
          {ACCOUNT_SCREENS.map((screen, index) => (
            <Stack.Screen key={index} name={screen.name} component={screen.component} animationEnabled={true} options={{ headerShown: false }} />
          ))}
        </Stack.Navigator>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountRegisterScreen;
