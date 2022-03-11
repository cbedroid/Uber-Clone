import React from "react";
import { View, Text } from "react-native";
import { Image, Input } from "react-native-elements";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
const covidMask = require("../../assets/covid_mask.webp");

const NoteCard = () => {
  return (
    <View style={tw`mt-4`}>
      <Text style={tw`text-xs text-gray-500`}>Driver may record trip for added safety</Text>
      <View style={tw`flex flex-row border-b border-gray-100 my-2`}>
        <Input
          placeholder="Any pickup notes?"
          containerStyle={tw`w-3/4`}
          inputContainerStyle={tw`bg-gray-200 h-10 rounded-2xl border-0 p-1`}
          inputStyle={tw`text-sm text-gray-800 border-0 p-2`}
        />
        <View style={tw`flex flex-row justify-around w-1/4 `}>
          <Icon type="material" size={22} name="phone" containerStyle={tw`bg-gray-200 rounded-full w-8 h-8 p-1`} />
          <Icon type="ionicon" size={22} name="sunny" solid containerStyle={tw`bg-gray-200 rounded-full w-8 h-8 p-1`} />
        </View>
      </View>
      <View style={tw`flex flex-row justify-between items-center px-2`}>
        <Text style={[tw`text-sm text-gray-500 w-2/3`, { fontFamily: "UberMoveMedium" }]}>Expect some pick up delays as we rev back up</Text>
        <Image style={{ width: 85, height: 80, resizeMode: "contain" }} source={covidMask} />
      </View>
    </View>
  );
};

export default NoteCard;
