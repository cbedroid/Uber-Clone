import React from "react";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectOrigin } from "../features/navSlice";
const uberEats = require("../assets/uber_eats_fork.webp");
const UberCar = require("../assets/uber_ride.webp");

const data = [
  {
    id: "123",
    title: "Get a ride",
    image: UberCar,
    screen: "MapScreen",
  },
  {
    id: "456",
    title: "Order food",
    image: uberEats,
    screen: "EatsScreen",
  },
];

const NavOptions = () => {
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);
  return (
    <SafeAreaView>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={!origin}
            onPress={() => navigation.navigate(item.screen)}
            style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40 h-60 rounded-md shadow-sm  ${!origin && "opacity-20 "}`}
          >
            <Image style={{ width: 120, height: 120, resizeMode: "contain" }} source={item.image} />
            <Text style={tw`mt-2 text-lg font-bold`}>{item.title}</Text>
            <Icon style={tw`p-2 ${origin ? "bg-black" : "bg-gray-400"} rounded-full w-10 mt-4`} name="arrowright" color="white" type="antdesign" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default NavOptions;
