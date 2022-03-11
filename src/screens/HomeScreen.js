import React, { useEffect } from "react";
import { View, SafeAreaView, Image, Text, ScrollView } from "react-native";
import { Platform } from "react-native";
import { Keyboard } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { MAPQUEST_APIKEY } from "@env";
import axios from "axios";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { Button, FAB } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import NavFavourites from "../components/NavFavourites";
import NavOptions from "../components/NavOptions";
import SearchButton from "../components/subcomponents/SearchButton";
import { setNearbyPlaces, selectNearbyPlaces, setUserLocation } from "../features/locationSlice";
// eslint-disable-next-line import/no-unresolved
const _ = require("lodash");
const UberRideCar = require("../assets/uber_x_icon_nbg_2.webp");

const HomeScreen = () => {
  const dispatch = useDispatch();
  const nearbyPlaces = useSelector(selectNearbyPlaces);
  const dropDownRef = React.createRef();
  const scrollRef = React.createRef();

  useEffect(() => {
    if (!scrollRef || !scrollRef.current) return;

    Keyboard.addListener("keyboardDidShow", () => {
      scrollRef.current.scrollTo({ y: 520, animate: true });
    });
    Keyboard.addListener("keyboardDidHide", () => {
      scrollRef.current.scrollTo({ y: 0, animate: true });
    });
  });

  useEffect(() => {
    console.log("HomeScreen loaded");

    getUserLocation();
  }, []);

  const getUserLocation = async () => {
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
    const location = await Location.getCurrentPositionAsync({});

    if (!_.isEmpty(nearbyPlaces)) return;
    getNearbyPlaces(location);
    fetchUserAddress(location);
  };

  const getNearbyPlaces = async (location) => {
    const lat = location?.coords?.latitude;
    const lon = location?.coords?.longitude;

    const baseURL = "http://www.mapquestapi.com/search/v2/radius";

    const api_resp = await axios({
      baseURL: baseURL,
      method: "GET",
      params: {
        maxMatches: 10,
        origin: `${lat},${lon}`,
        key: MAPQUEST_APIKEY,
      },
      responseType: "json",
    });

    if (api_resp.status !== 200) return;
    dispatch(setNearbyPlaces(api_resp.data.searchResults));
  };

  const fetchUserAddress = async (location) => {
    console.log("Fetching User Address ");
    const lat = location?.coords?.latitude;
    const lon = location?.coords?.longitude;
    const baseURL = "http://www.mapquestapi.com/geocoding/v1/reverse";

    const api_resp = await axios({
      baseURL: baseURL,
      method: "GET",
      params: {
        location: `${lat},${lon}`,
        key: MAPQUEST_APIKEY,
      },
      responseType: "json",
    });

    if (api_resp.status !== 200) return;

    dispatch(setUserLocation(api_resp.data.results[0].locations[0]));
  };

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <ScrollView
        style={[tw`pt-3 h-2/5`, { flex: 1 }]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => {
          dropDownRef.current.hideDropDown();
        }}
        ref={scrollRef}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={[tw`relative flex h-full`, { backgroundColor: "#286DED", borderBottomRightRadius: 125 }]}>
          <View
            style={[
              tw`px-4`,
              {
                backgroundColor: "#286DED",
                borderBottomRightRadius: 125,
                transform: [{ translateX: 8 }],
              },
            ]}
          >
            <View style={tw`h-24`}>
              <FAB visible={true} icon={{ name: "menu", type: "fontawesome" }} size="small" style={tw`absolute top-8 left-0 `} color="#EFF1F2" />
              {/* <Image style={{ width: 75, height: 100, resizeMode: "contain" }} source={UberLogo} /> */}
            </View>
            <View>
              <Text style={tw`text-2xl font-bold text-white my-2`}>See you There</Text>
              <Text style={tw`text-white font-light`}>Travel soon? Request pickup at any hour</Text>
              <Button
                title="Book Now"
                buttonStyle={{ backgroundColor: "black", borderRadius: 30, width: 100 }}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 0,
                  marginVertical: 15,
                }}
              />
              <Image
                style={[
                  tw`absolute -bottom-20  z-50`,
                  {
                    width: 90,
                    height: 100,
                    resizeMode: "contain",
                    right: -18,
                    transform: [{ rotate: "-25deg" }],
                  },
                ]}
                source={UberRideCar}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={tw`mt-4 z-50 h-3/5`}>
        <NavOptions />
        <SearchButton />
        <NavFavourites />
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;
