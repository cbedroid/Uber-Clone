import React, { useEffect } from "react";
import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Keyboard } from "react-native";
import { Button, Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import MapQuestAutoComplete from "../components/MapQuestAutoComplete";
import NavFavourites from "../components/NavFavourites";
import NavOptions from "../components/NavOptions";
import { setDestination, setOrigin, selectOrigin } from "../features/navSlice";
const UberLogo = require("../assets/uber_logo.webp");
const UberRideCar = require("../assets/uber_x_icon_nbg_2.webp");

const HomeScreen = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const dropDownRef = React.createRef();
  const scrollRef = React.createRef();

  useEffect(() => {
    console.log("HomeScreen loaded");
    if (!scrollRef || !scrollRef.current) return;

    Keyboard.addListener("keyboardDidShow", () => {
      scrollRef.current.scrollTo({ y: 420, animate: true });
    });

    Keyboard.addListener("keyboardDidHide", () => {
      scrollRef.current.scrollTo({ y: 0, animate: true });
    });
  }, []);

  const submitOrigin = (results) => {
    if (!results) return;

    dispatch(
      setOrigin({
        name: results.name,
        location: {
          lat: parseFloat(results.place.geometry.coordinates[1]),
          lng: parseFloat(results.place.geometry.coordinates[0]),
          latitudeDelta: 0.0005,
          longitudeDelta: 0.0005,
        },
        description: results.displayString,
      })
    );
    // reset destination for new results
    dispatch(setDestination(null));
  };

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <ScrollView
        style={[tw`pt-3`, { flex: 1 }]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => {
          dropDownRef.current.hideDropDown();
        }}
        ref={scrollRef}
        contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={[
            tw`flex h-full`,
            { backgroundColor: "#286DED", borderBottomRightRadius: 125 },
          ]}
        >
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
            <View style={tw`flex flex-row  items-center justify-between`}>
              <TouchableOpacity>
                <Icon name="menu" type="fontawesome" size={28} color="white" />
              </TouchableOpacity>
              <Image
                style={{ width: 75, height: 100, resizeMode: "contain" }}
                source={UberLogo}
              />
            </View>
            <View style={tw`mt-5`}>
              <Text style={tw`text-2xl font-bold text-white my-2`}>
                See you There
              </Text>
              <Text style={tw`text-white font-light`}>
                Travel soon? Request pickup at any hour
              </Text>
              <Button
                title="Book Now"
                buttonStyle={{
                  backgroundColor: "black",
                  borderRadius: 30,
                  width: 100,
                }}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 0,
                  marginVertical: 15,
                }}
              />
            </View>
            <Image
              style={[
                tw`absolute -bottom-20  z-50`,
                {
                  width: 90,
                  height: 100,
                  resizeMode: "contain",
                  right: -10,
                  transform: [{ rotate: "-25deg" }],
                },
              ]}
              source={UberRideCar}
            />
          </View>
        </View>
      </ScrollView>

      <View style={tw`mt-4 z-50`}>
        <NavOptions />
        <MapQuestAutoComplete
          ref={dropDownRef}
          placeholder={"Where to?"}
          handleSubmit={(data) => submitOrigin(data)}
          locationProp={origin}
        />
        <NavFavourites />
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;
