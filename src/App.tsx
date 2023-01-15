import React, { useEffect, useState } from "react";

import { KeyboardAvoidingView, Platform } from "react-native";
import { LogBox } from "react-native";

import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AccountRegisterScreen from "screens/Accounts/AccountRegisterScreen";
import { RootStackParams } from "screens/Accounts/types";
import EatsScreen from "screens/EatsScreen";
import HomeScreen from "screens/HomeScreen";
import MapScreen from "screens/MapScreen";
import PickupTimeScreen from "screens/PickupTimeScreen";
import SafetyScreen from "screens/SafetyScreen";

import { FirebaseProvider } from "./contexts/FirebaseContext";
import LoadingScreen from "./screens/LoadingScreen";
import SearchScreen from "./screens/SearchScreen";
import Store from "./store/index";
import { appPersist } from "./store/index";

LogBox.ignoreLogs(["Async Storage has been extracted from react-native core"]);

export const APP_NAME = "Uber Clone";

export const loadFont = async () =>
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
  const RootStack = createStackNavigator<RootStackParams>();
  const [appIsReady, setAppIsReady] = useState(false);

  // @ts-ignore
  useReduxDevToolsExtension(navigationRef);
  // Keep the splash screen visible while we fetch resources
  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await loadFont();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={Store}>
      <PersistGate persistor={appPersist}>
        <FirebaseProvider>
          <NavigationContainer ref={() => navigationRef}>
            <SafeAreaProvider>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
                style={{ flex: 1 }}
              >
                <RootStack.Navigator initialRouteName="LoadingScreen">
                  <RootStack.Screen
                    name="LoadingScreen"
                    component={LoadingScreen}
                    options={{ headerShown: false }}
                  />
                  <RootStack.Screen
                    name="SafetyScreen"
                    component={SafetyScreen}
                    options={{ headerShown: false }}
                  />
                  <RootStack.Screen
                    name="AccountRegisterScreen"
                    component={AccountRegisterScreen}
                    options={{ headerShown: false }}
                  />
                  <RootStack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                  />
                  <RootStack.Screen
                    name="MapScreen"
                    component={MapScreen}
                    options={{ headerShown: false }}
                  />
                  <RootStack.Screen
                    name="EatsScreen"
                    component={EatsScreen}
                    options={{ headerShown: false }}
                  />
                  <RootStack.Screen
                    name="PickupTimeScreen"
                    component={PickupTimeScreen}
                    options={{ headerShown: false }}
                  />
                  <RootStack.Screen
                    name="SearchScreen"
                    component={SearchScreen}
                    options={{ headerShown: false }}
                  />
                </RootStack.Navigator>
              </KeyboardAvoidingView>
            </SafeAreaProvider>
          </NavigationContainer>
        </FirebaseProvider>
      </PersistGate>
    </Provider>
  );
}
