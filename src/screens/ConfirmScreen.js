import React from "react";
import { SafeAreaView } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ConfirmPaymentOptions from "../components/ConfirmPaymentOptions";

const ConfirmScreen = (props) => {
  const Stack = createStackNavigator();

  React.useEffect(() => {
    console.log("\nNAV SCREEN");
  });

  return (
    <SafeAreaView style={{ flex: 1, width: "100%" }} edges={["right", "left", "bottom"]}>
      <Stack.Navigator>
        <Stack.Screen
          name="confirmPlaymentOptions"
          component={ConfirmPaymentOptions}
          options={{ headerShown: false }}
          initialParams={{ ...props?.route?.params }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default ConfirmScreen;
