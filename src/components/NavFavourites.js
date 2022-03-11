import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectUserLocation } from "../features/locationSlice";

const NavFavourites = () => {
  const userLocation = useSelector(selectUserLocation);
  const data = [
    {
      id: "123",
      icon: "home",
      location: "Home",
      destination: userLocation ? `${userLocation.street} , ${userLocation.adminArea5}, ${userLocation.adminArea3}` : "5555 SomePlace street",
    },
    {
      id: "456",
      icon: "briefcase",
      location: "Work",
      destination: "1455 Market St #400, San Francisco, CA",
    },
  ];
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={[tw`bg-gray-200`, { height: 0.5 }]} />}
        renderItem={({ item: { location, destination, icon } }) => (
          <TouchableOpacity style={tw`flex-row items-center p-5`}>
            <Icon style={tw`mr-4 rounded-full bg-gray-300 p-3`} name={icon} type="ionicon" color="white" size={18} />
            <View>
              <Text style={tw`font-bold text-lg`}>{location}</Text>
              <Text style={tw`text-gray-500`}>{destination}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default NavFavourites;
