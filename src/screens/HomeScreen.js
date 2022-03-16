import React, { useEffect } from "react";
import { View, SafeAreaView, Image, Text, ScrollView } from "react-native";
import { Keyboard } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { Button, FAB } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import NavFavourites from "../components/NavFavourites";
import NavOptions from "../components/NavOptions";
import SearchButton from "../components/subcomponents/SearchButton";
// eslint-disable-next-line import/no-unresolved
const _ = require("lodash");
const UberRideCar = require("../assets/uber_x_icon_nbg_2.webp");

const HomeScreen = () => {
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
            </View>
            <View>
              <Text style={tw`text-2xl font-bold text-white my-2`}>See You There</Text>
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
