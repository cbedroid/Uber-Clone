import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Apploading from "expo-app-loading";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import AccountRegisterScreen from "./screens/AccountRegisterScreen";
import EatsScreen from "./screens/EatsScreen";
import HomeScreen from "./screens/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import MapScreen from "./screens/MapScreen";
import PickupTimeScreen from "./screens/PickupTimeScreen";
import SafetyScreen from "./screens/SafetyScreen";
import SearchScreen from "./screens/SearchScreen";
import ChoosePlaceScreen from "./screens/SelectPlaceScreen";
import Store from "./store/index";

const loadFont = async () =>
  Font.loadAsync({
    UberMoveRegular: require("./assets/fonts/UberMove-Regular.ttf"),
    UberMoveMedium: require("./assets/fonts/UberMove-Medium.ttf"),
    UberTextRegular: require("./assets/fonts/UberMoveText-Regular.ttf"),
    VisbySemibold: require("./assets/fonts/VisbySemibold.ttf"),
    VisbyRegular: require("./assets/fonts/VisbyRegular.ttf"),
    VisbyMedium: require("./assets/fonts/VisbyMedium.ttf"),
    VisbyLight: require("./assets/fonts/VisbyLight.ttf"),
    VisbyThin: require("./assets/fonts/VisbyThin.ttf"),
    VisbyThinItalic: require("./assets/fonts/VisbyThinItalic.ttf"),
  });

export default function App() {
  const navigationRef = React.createRef();
  const Stack = createStackNavigator();
  const [fontLoaded, setFontLoaded] = useState(false);

  useReduxDevToolsExtension(navigationRef);

  if (fontLoaded) {
    return (
      <Provider store={Store}>
        <NavigationContainer ref={() => navigationRef}>
          <SafeAreaProvider>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
              style={{ flex: 1 }}
            >
              <Stack.Navigator initialRouteName="LoadingScreen">
                <Stack.Screen name="LoadingScreen" component={LoadingScreen} animationEnabled={true} options={{ headerShown: false }} />
                <Stack.Screen name="SafetyScreen" component={SafetyScreen} animationEnabled={true} options={{ headerShown: false }} />
                <Stack.Screen name="AccountRegisterScreen" component={AccountRegisterScreen} animationEnabled={true} options={{ headerShown: false }} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} animationEnabled={true} options={{ headerShown: false }} />
                <Stack.Screen name="MapScreen" component={MapScreen} animationEnabled={true} options={{ headerShown: false }} />
                <Stack.Screen name="EatsScreen" component={EatsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PickupTimeScreen" component={PickupTimeScreen} animationEnabled={true} options={{ headerShown: false }} />
                <Stack.Screen name="SearchScreen" component={SearchScreen} animationEnabled={true} options={{ headerShown: false }} />
              </Stack.Navigator>
            </KeyboardAvoidingView>
          </SafeAreaProvider>
        </NavigationContainer>
      </Provider>
    );
  } else {
    return (
      <Apploading
        startAsync={loadFont}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }
}
