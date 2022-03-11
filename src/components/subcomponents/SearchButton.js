import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const SearchButton = (props) => {
  const navigation = useNavigation();
  return (
    <View style={tw`flex flex-row items-center bg-gray-200 rounded-md mx-4 my-2 p-2`}>
      <TouchableOpacity style={tw`flex-1`} onPress={() => navigation.navigate("SearchScreen")}>
        <Text style={[tw`text-xl`, { fontFamily: "UberMoveMedium" }]}>{props?.placeholder || "Where To?"} </Text>
      </TouchableOpacity>
      <View style={tw`border-l border-gray-300 px-4`}>
        <TouchableOpacity
          style={tw`flex flex-row items-center justify-around bg-white rounded-2xl w-24 h-8 mr-4`}
          onPress={() => navigation.navigate("PickupTimeScreen")}
        >
          <Icon type="ionicon" name="time" />
          <Text style={tw`font-bold`}>Now</Text>
          <Icon type="font-awesome" name="angle-down" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchButton;
