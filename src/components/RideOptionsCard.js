import "intl";
import "intl/locale-data/jsonp/en";

import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import moment from "moment";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectTravelTimeInformation } from "../features/navSlice";
import { setDriver, setRide } from "../features/rideSlice";
const { faker } = require("@faker-js/faker");
const UberLux = require("../assets/uber_lux_car.webp");
const UberX = require("../assets/uber_x_car.webp");
const UberXL = require("../assets/uber_xl_car.webp");

const uberFares = {
  baseFare: 98,
  perMin: 16,
  perMile: 85,
  surCharge: 100,
  longPickupFee: 119,
  bookingFee: 217,
  minimumFee: 709,
};
const data = [
  {
    id: "Uber-X-123",
    title: "UberX",
    passengers: 3,
    points: 1,
    multiplier: 1,
    image: UberX,
  },
  {
    id: "Uber-XL-456",
    title: "Uber XL",
    passengers: 5,
    points: 2,
    multiplier: 1.3,
    image: UberXL,
  },
  {
    id: "Uber-LUX-789",
    title: "Uber LUX",
    passengers: 3,
    points: 3,
    multiplier: 2.15,
    image: UberLux,
  },
];

const driverData = () => {
  return {
    name: faker.name.firstName(),
    avatar: faker.image.avatar(),
    vehicle: faker.fake("{{vehicle.color}} {{vehicle.vehicle}}"),
    license_plate: faker.vehicle.vrm(),
    rating: (Math.random() * 2 + 3).toFixed(2),
  };
};

const RideOptionCard = ({ navigation: { navigate } }) => {
  const [selected, setSelectedItem] = useState(null);
  const [paymentRates, setPaymentRates] = useState(null);
  const [currentRate, setCurrentRate] = useState({});

  const travelTimeInfo = useSelector(selectTravelTimeInformation);

  // Surge charge base on the time of the day, events, holiday ..etc
  // TODO: Added surge charge to day,night, and holidays
  // const SURGE_CHARGE_RATE = 1.5;

  const dispatch = useDispatch();

  useEffect(() => {
    // setPaymentRates(null);
    console.log("RideOptionCard loaded");
    const initial_rates = data.map((item) => calculateInternationalRate(item));
    setPaymentRates(initial_rates);
  }, [travelTimeInfo]);

  const fetchVehicleModel = async () => {
    //DOC: https://carsapi1.docs.apiary.io/#reference/0/cars-collection/
    // TODO: Move api to redux to prevent recall api
    const url = "https://private-anon-c49f61dfdb-carsapi1.apiary-mock.com/cars";
    const response = await axios({
      baseURL: url,
      method: "GET",
      responseType: "json",
    });

    if (!response || response.status !== 200) return;
    let car = [];
    while (car.length === 0) {
      const [make, model] = faker.vehicle.vehicle().split(" ");
      car = response.data.filter((car) => {
        return car.make === make.toLowerCase() && car.model === model.toLowerCase();
      });
    }

    dispatch(
      setDriver({
        ...driverData(),
        ...{ vehicle: { ...car[0], color: faker.vehicle.color() } },
      })
    );
  };

  const handleTravelTime = (duration) => {
    if (!duration) return "";
    const [h, m, _] = duration.split(":");
    return h > 0 ? `${+h} hour${+h > 1 ? "s" : ""} ${+m} min${+m > 1 ? "s" : ""}` : `${+m} min${+m > 1 ? "s" : ""}`;
  };

  const calculateInternationalRate = ({ id, multiplier }) => {
    if (!travelTimeInfo) return;
    // apply Uber base fare charges to Ride
    const minimumFee = uberFares.minimumFee;
    let currentFare =
      uberFares.baseFare +
      uberFares.surCharge +
      (travelTimeInfo.time / 60) * uberFares.perMin +
      Math.floor(+travelTimeInfo.distance) * uberFares.perMile +
      uberFares.bookingFee;

    // check Uber Fare surpass the minimumFee
    currentFare = currentFare >= minimumFee ? currentFare : minimumFee;

    const rate = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
    }).format((currentFare * multiplier) / 100);

    const [dollars, cents] = rate.toString().split(".");
    const currentRates = paymentRates || {};

    // break down fare into a price categories
    currentRates[id] = {
      id: id,
      dollars: dollars,
      cents: cents,
      real_price: rate,
    };
    return currentRates[id];
  };

  const handleSelect = (item) => {
    if (item === selected) return;
    setSelectedItem(item);
    if (!paymentRates) return;
    const payRate = paymentRates[data.indexOf(item)];
    setCurrentRate(payRate);
    fetchVehicleModel();
  };

  const carOptionList = React.useCallback(
    ({ item: { id, title, image }, item, index }) => {
      return (
        <View>
          <TouchableOpacity style={tw`flex-row items-center justify-between px-4  ${id === selected?.id && "bg-gray-200"}`} onPress={() => handleSelect(item)}>
            <Image style={{ width: 100, height: 100, resizeMode: "contain" }} source={image} />
            <View style={tw`-ml-3 flex-1`}>
              <View style={tw`flex flex-row items-end`}>
                <Text style={[tw`text-xl mr-1`, { fontFamily: "UberMoveMedium" }]}>{title}</Text>
                {id === selected?.id && (
                  <>
                    <Icon style={tw`self-end p-1 pr-0`} name="user" type="font-awesome" size={14} />
                    <Text style={[{ lineHeight: 32 }]}> {item.passengers}</Text>
                  </>
                )}
              </View>

              <Text style={[tw`text-xs text-gray-600`, { fontFamily: "UberTextRegular" }]}>
                {moment().add(travelTimeInfo?.time, "seconds").format("hh:mm A")} {id === selected?.id && "dropoff"}
              </Text>
              {id === selected?.id && (
                <Text style={[tw`text-xs text-gray-600`, { fontFamily: "UberTextRegular" }]}>
                  {handleTravelTime(travelTimeInfo?.formattedTime)} travel time...
                </Text>
              )}
            </View>
            <View>
              {paymentRates && (
                <View style={tw`flex flex-row `}>
                  <Text style={tw`text-xl font-bold`}>{paymentRates[index]?.dollars}</Text>
                  <Text style={{ fontSize: 14, lineHeight: 22 }}>{paymentRates[index]?.cents}</Text>
                </View>
              )}
              <Text style={tw`text-gray-400 font-semibold`}>{item?.points}x pts</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [selected, paymentRates]
  );

  const listHeader = React.useCallback(() => {
    return (
      <View>
        <Text style={[tw`text-center py-5`, { fontFamily: "UberTextMedium", color: "#000", fontWeight: "200" }]}>Choose a ride, or swipe up for more</Text>
      </View>
    );
  }, []);

  const handleSubmit = () => {
    const params = { currentRate: currentRate?.real_price, ride: data.filter((ride) => ride.id === selected?.id) };
    dispatch(setRide(params));
    navigate({
      name: "ConfirmPaymentCard",
      params: params,
    });
  };
  const selectRideButton = React.useCallback(() => {
    return (
      <View style={tw`border-t border-gray-200 pt-1 mt-auto`}>
        <TouchableOpacity onPress={handleSubmit} style={tw`bg-black py-3 mx-3 ${!selected && "bg-gray-300"}`} disabled={!selected}>
          <Text style={tw`text-white text-center text-xl`}>
            {selected?.title ? "Choose - " + selected.title + " " + currentRate?.real_price : "Choose Ride"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [selected]);

  return (
    <SafeAreaView style={tw`bg-white flex-grow`}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={carOptionList}
        ListHeaderComponent={listHeader}
        ListFooterComponent={selectRideButton}
      />
    </SafeAreaView>
  );
};

export default RideOptionCard;
