import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import ConfirmScreen from "./screens/ConfirmScreen";
import EatsScreen from "./screens/EatsScreen";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import Store from "./store/index";

export default function App() {
  // const navigationRef = useNavigationContainerRef();
  // useReduxDevToolsExtension(navigationRef);

  const Stack = createStackNavigator();
  useFonts({
    UberMoveRegular: require("./assets/fonts/UberMove-Regular.ttf"),
    UberMoveMedium: require("./assets/fonts/UberMove-Medium.ttf"),
    UberTextRegular: require("./assets/fonts/UberMoveText-Regular.ttf"),
    UberTextMedium: require("./assets/fonts/UberMoveText-Medium.ttf"),
  });

  return (
    <Provider store={Store()}>
      <NavigationContainer>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
            style={{ flex: 1 }}
          >
            <Stack.Navigator>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                animationEnabled={true}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                animationEnabled={true}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ConfirmScreen"
                component={ConfirmScreen}
                animationEnabled={true}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="EatsScreen" component={EatsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
