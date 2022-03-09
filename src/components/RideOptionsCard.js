import "intl";
import "intl/locale-data/jsonp/en";

import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectTravelTimeInformation } from "../features/navSlice";
const UberLux = require("../assets/uber_lux_car.webp");
const UberX = require("../assets/uber_x_car.webp");
const UberXL = require("../assets/uber_xl_car.webp");

const data = [
  {
    id: "Uber-X-123",
    title: "UberX",
    points: 1,
    multiplier: 1,
    image: UberX,
  },
  {
    id: "Uber-XL-456",
    title: "Uber XL",
    points: 2,
    multiplier: 1.2,
    image: UberXL,
  },
  {
    id: "Uber-LUX-789",
    title: "Uber LUX",
    points: 3,
    multiplier: 1.75,
    image: UberLux,
  },
];

const NavigateCard = () => {
  const navigation = useNavigation();
  const [selected, setSelectedItem] = useState(null);
  const [paymentRates, setPaymentRates] = useState(null);
  const [currentRate, setCurrentRate] = useState({});

  const travelTimeInfo = useSelector(selectTravelTimeInformation);

  // Surge charge base on the time of the day, events, holiday ..etc
  // TODO: Added surge charge to day,night, and holidays
  const SURGE_CHARGE_RATE = 1.5;

  useEffect(() => {
    console.log("RideOption loaded", travelTimeInfo);
    // setPaymentRates(null);
    console.log("\n********************************************************************************");
    const initial_rates = data.map((item) => calculateInternationalRate(item));
    setPaymentRates(initial_rates);
    console.log("\n\nRideRate", initial_rates);
  }, [travelTimeInfo]);

  const handleTravelTime = (duration) => {
    if (!duration) return "";
    const [h, m, _] = duration.split(":");
    return h > 0 ? `${+h} hour${+h > 1 ? "s" : ""} ${+m} min${+m > 1 ? "s" : ""}` : `${+m} min${+m > 1 ? "s" : ""}`;
  };

  const calculateInternationalRate = ({ id, multiplier }) => {
    if (!travelTimeInfo) return;
    const rate = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
    }).format((+travelTimeInfo?.time * SURGE_CHARGE_RATE * multiplier) / 100);

    const [dollars, cents] = rate.toString().split(".");
    const currentRates = paymentRates || {};
    currentRates[id] = {
      id: id,
      dollars: dollars,
      cents: cents,
      real_price: rate,
    };
    console.log("\nRate for ", id, rate, travelTimeInfo?.realTime);
    return currentRates[id];
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    if (!paymentRates) return;
    console.log("Setting Current Rate");
    const payRate = paymentRates[data.indexOf(item)];
    setCurrentRate(payRate);
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
        renderItem={({ item: { id, title, multiplier, image }, item, index }) => (
          <TouchableOpacity
            style={tw`flex-row items-center justify-between px-4  ${id === selected?.id && "bg-gray-200"}`}
            onPress={() => handleSelect(item)}
          >
            <Image style={{ width: 100, height: 100, resizeMode: "contain" }} source={image} />
            <View style={tw`-ml-3 flex-1`}>
              <Text style={tw`text-xl font-bold`}>{title}</Text>
              <Text style={tw`font-normal w-48`}>{handleTravelTime(travelTimeInfo?.formattedTime)} Travel Time...</Text>
            </View>
            <View>
              {paymentRates && (
                <View style={tw`flex flex-row `}>
                  <Text style={tw`text-xl font-bold`}>{paymentRates[index]?.dollars}</Text>
                  <Text style={{ fontSize: 14, lineHeight: 24 }}>{paymentRates[index]?.cents}</Text>
                </View>
              )}
              <Text style={tw`text-gray-400 font-semibold`}>{item?.points}x pts</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={tw`border-t border-gray-200 pt-1 mt-auto`}>
        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({
                name: "ConfirmScreen",
                params: { currentRate: currentRate?.real_price },
              })
            )
          }
          style={tw`bg-black py-3 mx-3 ${!selected && "bg-gray-300"}`}
          disabled={!selected}
        >
          <Text style={tw`text-white text-center text-xl`}>
            Choose {selected?.title}
            {" - "}
            {currentRate?.real_price}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;
