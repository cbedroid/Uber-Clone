import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import StackBottomSheet from "../components/StackBottomSheet";
const moment = require("moment");

const PickupTimeSlash = () => {
  const navigation = useNavigation();

  /* Icons: https://oblador.github.io/react-native-vector-icons */
  const datalist = [
    {
      id: "1",
      icon: {
        type: "font-awesome",
        name: "hourglass-1",
        size: 24,
      },
      text: "Extra wait time included to meet your ride",
    },
    {
      id: "2",
      icon: {
        type: "font-awesome-5",
        name: "calendar-day",
        size: 24,
      },
      text: "Choose your pickup time up to 30 days",
    },
    {
      id: "3",
      icon: {
        type: "font-awesome",
        name: "credit-card-alt",
        size: 18,
      },
      text: "Cancel at no charge up to 60 minutes in advance",
    },
  ];

  const Header = () => {
    return (
      <View>
        <TouchableOpacity
          style={tw`w-14 my-4`}
          onPress={() => {
            navigation.navigate("HomeScreen");
          }}
        >
          <Icon type="ionicon" name="ios-close-sharp" size={40} />
        </TouchableOpacity>
        <View style={[tw`px-4 mb-4`, { ...styles.title }]}>
          <Text style={[tw`text-4xl mb-8`, { ...styles.title, fontSize: 36 }]}>When do you want to be picked up?</Text>
          <View style={tw`flex items-center mb-6`}>
            <Text style={[tw`text-xl text-gray-800 `]}>{moment().format("ddd, MMM D")}</Text>
            <View style={[tw`border-b border-gray-200 h-1 my-4 w-full `]}></View>
            <Text style={[tw`text-2xl text-gray-800`, { fontFamily: "UberTextRegular" }]}>{moment().format("h:mm a")}</Text>
          </View>
          <Text style={[tw`font-semibold`, { fontFamily: "UberTextMedium" }]}>Added flexibility if you book 2 hours ahead</Text>
        </View>
      </View>
    );
  };

  const RenderItem = ({ item }) => {
    const isNotLastItem = +(item?.id || 3) !== datalist.length;
    return (
      <View style={tw`flex flex-row items-center p-2 px-6`}>
        <Icon type={item?.icon?.type} name={item?.icon?.name} size={item.icon.size} />
        <Text style={[tw`text-lg text-gray-700 ${isNotLastItem && "border-b border-gray-200"} pb-2 ml-6`, { fontSize: 16, lineHeight: 24 }]}>{item?.text}</Text>
      </View>
    );
  };

  const Footer = () => {
    return (
      <View style={tw`p-4 h-64`}>
        <Text style={tw`font-bold underline p-6`}>See Terms</Text>
        <Button containerStyle={tw`mt-auto`} buttonStyle={tw`bg-black p-4`} titleStyle={tw`text-xl`} title="Set pickup time" />
      </View>
    );
  };
  return (
    <StackBottomSheet>
      <BottomSheetFlatList
        data={datalist}
        keyExtractor={(item) => item.id}
        renderItem={(item) => RenderItem(item)}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
      />
    </StackBottomSheet>
  );
};

export default PickupTimeSlash;
const styles = StyleSheet.create({
  title: {
    fontFamily: "UberMoveMedium",
  },
});
