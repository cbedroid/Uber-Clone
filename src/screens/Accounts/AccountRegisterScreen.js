import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import EmailRegisterScreen from "./EmailRegisterScreen";
import NameRegisterScreen from "./NameRegisterScreen";
import PhoneSetupScreen from "./PhoneSetupScreen";
import PhoneVerificationScreen from "./PhoneVerificationScreen";
import SetPasswordScreen from "./SetPasswordScreen";

const AccountRegisterScreen = ({ navigation, route }) => {
  const Stack = createStackNavigator();
  const currentRoute = getFocusedRouteNameFromRoute(route);

  const screens = [
    {
      name: "PhoneSetupScreen",
      component: PhoneSetupScreen,
    },
    {
      name: "PhoneVerificationScreen",
      component: PhoneVerificationScreen,
    },
    {
      name: "EmailRegisterScreen",
      component: EmailRegisterScreen,
    },
    {
      name: "SetPasswordScreen",
      component: SetPasswordScreen,
    },
    {
      name: "NameRegisterScreen",
      component: NameRegisterScreen,
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw` flex-1 bg-gray-50 my-6 px-6`}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
      >
        <TouchableOpacity style={tw`w-full pb-4`} onPress={currentRoute !== "PhoneSetupScreen" && navigation.goBack}>
          <Icon style={tw`w-12 p-2 -ml-2`} type="font-awesome-5" name="arrow-left" color={currentRoute !== "PhoneSetupScreen" ? "#000" : "#ccc"} />
        </TouchableOpacity>
        <Stack.Navigator initialRouteName="PhoneSetUpScreen">
          {screens.map((screen, index) => (
            <Stack.Screen key={index} name={screen.name} component={screen.component} animationEnabled={true} options={{ headerShown: false }} />
          ))}
        </Stack.Navigator>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountRegisterScreen;
