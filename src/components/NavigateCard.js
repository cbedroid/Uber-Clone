import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { MAPQUEST_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import {
  setDestination,
  setDirections,
  setCoordinates,
  setTravelTimeInformation,
  selectDestination,
  selectOrigin,
} from "../features/navSlice";
import MapQuestAutoComplete from "./MapQuestAutoComplete";
// eslint-disable-next-line import/no-unresolved
import NavFavourites from "./NavFavourites";
const _ = require("lodash");

const NavigateCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [greetingMessage, setGreetingMessage] = useState("Good Mourning");
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapQuestDirectionalUrl =
    "http://www.mapquestapi.com/directions/v2/route";

  const dropDownRef = React.createRef();

  /* TODO: - Remove destination selector and use local state
           - Use global to set Destination, but not the selector 
           - Add loading component when fetching API and dispatching state
  */

  useEffect(() => {
    getDayTimeStatus();
    console.log("Navigation loaded");
  }, []);

  const getDayTimeStatus = () => {
    const now = new Date().getHours(); // 24hr time format
    const greeting_msg =
      now >= 12 && now < 18
        ? "Good Afternoon"
        : now >= 18 && now < 24
        ? "Good Evening"
        : "Good Mourning";
    setGreetingMessage(greeting_msg);
  };

  const handleOnPress = (results) => {
    dispatch(setDestination({}));

    if (!results) return;
    const fromPlace = {
      name: results.name,
      location: {
        lat: parseFloat(results.place.geometry.coordinates[1]),
        lng: parseFloat(results.place.geometry.coordinates[0]),
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005,
      },
      description: results.displayString,
    };
    dispatch(setDestination(fromPlace));

    // get Direction API
    getDirectionalApi(fromPlace);

    // navigate to RideScreen
    navigation.navigate("RideOptionsCard");
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

  const getDirectionalApi = async (fromPlace = {}) => {
    // show loading screen
    if (!origin) {
      console.log(
        `Can not fetch directions API\n No ${origin ? "destination" : "origin"}`
      );
      return; // need to show error
    }
    // reset directions in global state
    dispatch(setDirections([]));
    // get routes lat and lng from API
    console.log("Fetching Directional API");
    try {
      const api_resp = await axios({
        baseURL: mapQuestDirectionalUrl,
        method: "GET",
        params: {
          to: origin.description,
          from: fromPlace.description,
          unit: "m",
          key: MAPQUEST_APIKEY,
        },
        responseType: "json",
      });

      const resp_data = api_resp.data;
      // save direction routes to global state
      dispatch(setDirections(resp_data));
      parseDirectionalCoordinates(resp_data);

      try {
        // set travel time information
        const route_info = resp_data.route;
        dispatch(
          setTravelTimeInformation({
            distance: route_info.distance,
            formattedTime: route_info.formattedTime,
            realTime: route_info.realTime,
            fuelUsed: route_info.fuelUsed,
            options: route_info.options,
          })
        );
      } catch (t_error) {
        console.log("Travel Error", t_error);
      }
    } catch (error) {
      console.error("Error", error);
    }
    // remove loading screen
  };

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <View>
        <Text style={tw`text-center py-5 text-xl font-bold`}>
          {greetingMessage}
        </Text>
        <View>
          <MapQuestAutoComplete
            ref={dropDownRef}
            placeholder={"Where To?"}
            handleSubmit={(data) => handleOnPress(data)}
            locationProp={destination}
          />
        </View>
        <NavFavourites />
      </View>
      <View
        style={tw`bg-white flex-row justify-evenly border-gray-100 py-2 mt-auto`}
      >
        <TouchableOpacity
          style={tw`bg-black flex flex-row items-center justify-between w-24 px-4 py-3 border border-gray-200 rounded-full`}
          onPress={() => navigation.navigate("RideOptionsCard")}
        >
          <Icon name="car" type="font-awesome" color="white" size={16}></Icon>
          <Text style={tw`text-white text-center`}>Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-gray-50 flex flex-row items-center justify-between w-24 px-4 py-3 border border-gray-200 rounded-full`}
          onPress={() => navigation.navigate("EatsScreen")}
        >
          <Icon
            name="fast-food-outline"
            type="ionicon"
            color="black"
            size={16}
          ></Icon>
          <Text style={tw`text-black text-center`}>Eats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;
