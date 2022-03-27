import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { LogBox } from "react-native";
import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Apploading from "expo-app-loading";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { APP_SCREENS } from "./constants/appConstants";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import Store from "./store/index";
import { appPersist } from "./store/index";
import { loadFont } from "./Utils";
LogBox.ignoreLogs(["Async Storage has been extracted from react-native core"]);

export const APP_NAME = "Uber Clone";

export default function App() {
  const navigationRef = React.createRef();
  const Stack = createStackNavigator();
  const [fontLoaded, setFontLoaded] = useState(false);

  useReduxDevToolsExtension(navigationRef);

  if (fontLoaded) {
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
                  <Stack.Navigator initialRouteName="LoadingScreen">
                    {APP_SCREENS.map((screen, index) => (
                      <Stack.Screen key={index} name={screen.name} component={screen.component} animationEnabled={true} options={{ headerShown: false }} />
                    ))}
                  </Stack.Navigator>
                </KeyboardAvoidingView>
              </SafeAreaProvider>
            </NavigationContainer>
          </FirebaseProvider>
        </PersistGate>
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
