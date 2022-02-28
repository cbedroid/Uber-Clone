import "intl";
import "intl/locale-data/jsonp/en";

import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectTravelTimeInformation } from "../features/navSlice";
const UberLux = require("../assets/UberLux.webp");
const UberX = require("../assets/UberX.webp");
const UberXL = require("../assets/UberXL.webp");

const data = [
  {
    id: "Uber-X-123",
    title: "UberX",
    multiplier: 1,
    image: UberX,
  },
  {
    id: "Uber-XL-456",
    title: "Uber XL",
    multiplier: 1.2,
    image: UberXL,
  },
  {
    id: "Uber-LUX-789",
    title: "Uber LUX",
    multiplier: 1.75,
    image: UberLux,
  },
];

const NavigateCard = () => {
  const navigation = useNavigation();
  const [selected, setSelectedItem] = useState(null);
  const travelTimeInfo = useSelector(selectTravelTimeInformation);

  // Surge charge base on the time of the day, events, holiday ..etc
  // TODO: Added surge charge to day,night, and holidays
  const SURGE_CHARGE_RATE = 1.5;

  const handleTravelTime = (duration) => {
    if (!duration) return "";
    const [h, m, _] = duration.split(":");
    return h > 0
      ? `${+h} hour${+h > 1 ? "s" : ""} ${+m} min${+m > 1 ? "s" : ""}`
      : `${+m} min${+m > 1 ? "s" : ""}`;
  };
  return (
    <SafeAreaView style={tw`bg-white flex-grow`}>
      <View style={tw`text-black`}>
        <TouchableOpacity
          style={tw`absolute top-3 left-5 p-3 z-50 rounded-full`}
          onPress={() => navigation.navigate("NavigateCard")}
        >
          <Icon name="chevron-left" type="font-awesome" />
        </TouchableOpacity>
        <Text style={tw`text-center text-xl font-bold py-5`}>
          Select a Ride -{" "}
          <Text style={tw`font-normal`}>
            {travelTimeInfo?.distance.toFixed(2)} {travelTimeInfo && "mi"}
          </Text>
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item: { id, title, multiplier, image }, item }) => (
          <TouchableOpacity
            style={tw`flex-row items-center justify-between px-4  ${
              id === selected?.id && "bg-gray-200"
            }`}
            onPress={() => setSelectedItem(item)}
          >
            <Image
              style={{ width: 100, height: 100, resizeMode: "contain" }}
              source={image}
            />
            <View style={tw`-ml-3 flex-1`}>
              <Text style={tw`text-xl font-bold`}>{title}</Text>
              <Text style={tw`font-normal w-48`}>
                {handleTravelTime(travelTimeInfo?.formattedTime)} Travel Time...
              </Text>
            </View>
            <View>
              <Text style={tw`text-xl`}>
                {new Intl.NumberFormat("en-us", {
                  style: "currency",
                  currency: "USD",
                }).format(
                  (+travelTimeInfo?.realTime * SURGE_CHARGE_RATE * multiplier) /
                    100
                )}
              </Text>
              <Text style={tw`font-bold`}>Price</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={tw`border-t border-gray-200 pt-1 mt-auto`}>
        <TouchableOpacity
          style={tw`bg-black py-3 mx-3 ${!selected && "bg-gray-300"}`}
          disabled={!selected}
        >
          <Text style={tw`text-white text-center text-xl`}>
            Choose {selected?.title}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;
