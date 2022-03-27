import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        style={tw`w-full pb-4`}
        onPress={() => {
          if (navigation.canGoBack()) navigation.goBack();
        }}
      >
        <Icon style={tw`w-12 p-2 -ml-2`} type="font-awesome-5" name="arrow-left" color={navigation.canGoBack ? "#000" : "#ccc"} />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
