import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { getFocusedRouteNameFromRoute, useNavigationState } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import ConfirmPaymentCard from "../components/ConfirmPaymentCard";
import Maps from "../components/Maps";
import NavigateCard from "../components/NavigateCard";
import PickupCard from "../components/PickupCard";
import RideOptionsCard from "../components/RideOptionsCard";
const _ = require("lodash");

const MapScreen = ({ route, navigation }) => {
  const Stack = createStackNavigator();
  const currentRoute = getFocusedRouteNameFromRoute(route);
  const [isConfirmPage, setConfirmPageStatus] = useState(false);
  const [goBackRoute, setGoBackRoute] = useState(0);

  const confirmScreenNames = ["ConfirmPaymentCard"];
  const routes = useNavigationState((state) => state.routes.filter((router) => router.name === "MapScreen"));

  useEffect(() => {
    // console.log("MapScreen Loaded");
    getBackRoute();
  }, []);

  useEffect(() => {
    setConfirmPageStatus(confirmScreenNames.includes(currentRoute));
    console.log("isConfirmPage", currentRoute, isConfirmPage);
  });

  const getBackRoute = () => {
    /* 
      DOCS: https://reactnavigation.org/docs/5.x/screen-options-resolution/#setting-parent-screen-options-based-on-child-navigators-state
      
      Since we are using nested Navigator, there is no way of getting
       the `goBack()` route from the child Navigator. To fix this issue, 
       we can iterate down through the Parent Navigator to the Child Navigator
        and get the last dispatched route by the Root Navigator.
    */
    if (!routes) return;
    const mapRouteList = _.reverse(routes[0]?.state?.routes);
    const lastRoute = mapRouteList && mapRouteList.length > 1 ? mapRouteList[1]?.name : "HomeScreen";
    setGoBackRoute(lastRoute);
  };
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(goBackRoute);
        }}
        style={tw`bg-gray-200 absolute top-16 left-8 z-50 p-2 rounded-full shadow-lg`}
      >
        <Icon name={"arrow-back"} />
      </TouchableOpacity>
      <View style={tw`${isConfirmPage ? "h-4/6" : "h-1/2"}`}>
        <Maps overlay={isConfirmPage} />
      </View>
      <View style={tw`${isConfirmPage ? "h-2/6" : "h-1/2"}`}>
        <Stack.Navigator>
          <Stack.Screen name="NavigateCard" component={NavigateCard} options={{ headerShown: false }} />
          <Stack.Screen name="RideOptionsCard" component={RideOptionsCard} options={{ headerShown: false }} />
          <Stack.Screen name="ConfirmPaymentCard" component={ConfirmPaymentCard} options={{ headerShown: false }} />
          <Stack.Screen name="PickupCard" component={PickupCard} options={{ headerShown: false }} />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default MapScreen;
