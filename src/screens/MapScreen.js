import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { getFocusedRouteNameFromRoute, useNavigationState } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import ConfirmPaymentCard from "../components/ConfirmPaymentCard";
import Maps from "../components/Maps";
import PickupCard from "../components/PickupCard";
import RideOptionsCard from "../components/RideOptionsCard";
import { setDirections, setCoordinates, setTravelTimeInformation, selectDestination, selectOrigin } from "../features/navSlice";
import { fetchDirectionalApi } from "../Utils";
const _ = require("lodash");

const MapScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const Stack = createStackNavigator();
  const currentRoute = getFocusedRouteNameFromRoute(route);
  const [isConfirmPage, setConfirmPageStatus] = useState(false);
  const [goBackRoute, setGoBackRoute] = useState(0);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  const confirmScreenNames = ["ConfirmPaymentCard"];
  const routes = useNavigationState((state) => state.routes.filter((router) => router.name === "MapScreen"));

  useEffect(() => {
    // console.log("MapScreen Loaded");
    getBackRoute();
  }, []);

  useEffect(() => {
    setConfirmPageStatus(confirmScreenNames.includes(currentRoute));
    handleMapCoordinates();
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

  const parseDirectionalCoordinates = (data) => {
    /* Mapquest Directional DOC
     *https://developer.mapquest.com/documentation/directions-api/route/get/
     */
    if (!data || data.length === 0) return;
    const coords = _.map(data.route.legs[0]["maneuvers"], (maneuver) => {
      return {
        latitude: maneuver.startPoint.lat,
        longitude: maneuver.startPoint.lng,
      };
    });
    dispatch(setCoordinates(coords));
    return coords;
  };

  const handleMapCoordinates = async () => {
    // show loading screen
    if (!origin || !destination) return; // need to show error
    // reset directions in global state
    dispatch(setDirections([]));

    const api_resp = await fetchDirectionalApi(origin.description, destination.description);

    if (!api_resp || api_resp.status !== 200) return;

    // save direction routes to global state
    dispatch(setDirections(api_resp.data));
    parseDirectionalCoordinates(api_resp.data);

    try {
      // set travel time information
      const route_info = api_resp.data.route;
      dispatch(
        setTravelTimeInformation({
          distance: route_info.distance,
          time: route_info.time,
          formattedTime: route_info.formattedTime,
          fuelUsed: route_info.fuelUsed,
          options: route_info.options,
        })
      );
    } catch (t_error) {
      console.log("Travel Error", t_error);
    }

    // remove loading screen
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
          <Stack.Screen name="RideOptionsCard" component={RideOptionsCard} options={{ headerShown: false }} />
          <Stack.Screen name="ConfirmPaymentCard" component={ConfirmPaymentCard} options={{ headerShown: false }} />
          <Stack.Screen name="PickupCard" component={PickupCard} options={{ headerShown: false }} />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default MapScreen;
