import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing, Platform, Image } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { setUserLocation, setNearbyPlaces } from "../features/locationSlice";
import { fetchNearbyPlaces, fetchUserAddress } from "../Helper";
const _ = require("lodash");
const UberLogo = require("../assets/uber_logo_white.webp");

const LoadingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const scaleAnimation = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 350,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  });

  useEffect(() => {
    console.log("App loading");
    requestUserLocationPermission();
  }, []);

  useEffect(() => {
    if (!loading) navigation.navigate("HomeScreen");
  }, [loading]);

  const requestUserLocationPermission = async () => {
    /* @hide */
    if (Platform.OS === "android" && !Constants.isDevice) {
      alert("Oops, this will not work on Snack in an Android emulator. Try it on your device!");
      return;
    }
    /* @end */
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    // Requesting user location permissions
    let location = null;
    try {
      console.log("\nRequesting user location permissions ...");
      location = await Location.getCurrentPositionAsync({ accuracy: 5 });
    } catch {
      console.log("\nUserLocationRequest: denied");
    }

    // If location permission is granted, then get user's current location
    if (!_.isEmpty(location)) {
      console.log("\nFetching user location");
      const nearbyPlacesResponse = await fetchNearbyPlaces(location);
      const userAddressResponse = await fetchUserAddress(location);

      if (nearbyPlacesResponse.status === 200 || userAddressResponse.status === 200) {
        dispatch(setNearbyPlaces(nearbyPlacesResponse.data.searchResults));
        dispatch(setUserLocation(userAddressResponse.data.results[0].locations[0]));
      }
    }
    setLoading(false);
  };

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              scale: scaleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={tw`bg-black text-white flex content-center items-center w-full h-full`}>
        <Image style={[tw`my-auto`, { width: 150, height: 200, resizeMode: "contain" }]} source={UberLogo} />
      </View>
    </Animated.View>
  );
};

export default LoadingScreen;
