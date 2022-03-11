import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import faker from "@faker-js/faker";
// import { useNavigation, CommonActions } from "@react-navigation/native";
import { Card, Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectRide } from "../features/rideSlice";
import { textEllipsis } from "../Helper";
import ActionButtonGroup from "./ActionButtonGroup";
import StackBottomSheet from "./StackBottomSheet";
import DriverCard from "./subcomponents/DriverCard";
import NoteCard from "./subcomponents/NoteCard";

const PickupCard = () => {
  const randomPickupTime = Math.floor(Math.random() * 20);
  const ride = useSelector(selectRide);

  return (
    <SafeAreaView style={tw`bg-gray-200 flex-1`}>
      <StackBottomSheet>
        <ScrollView>
          <Card containerStyle={tw`p-2 px-4 m-0`}>
            <View style={tw`flex flex-row justify-between items-center  border-b border-gray-100 p-2 `}>
              <Text style={[tw`text-lg text-gray-800 `, { fontFamily: "UberMoveMedium" }]}>{textEllipsis("Meet By Pickup", 180)}</Text>
              <View style={tw`flex bg-blue-600 w-12 h-12 p-2 ml-2`}>
                <Text style={tw`text-lg text-white m-auto mb-1`}>{randomPickupTime}</Text>
                <Text style={tw`text-lg text-white  m-auto`}>min</Text>
              </View>
            </View>
            <DriverCard car_image={ride.ride[0]?.id} />
            <NoteCard />
          </Card>
          <Card containerStyle={tw`mt-2 mx-0 px-0 pb-0`}>
            <View style={tw`px-4`}>
              <View style={tw`flex flex-row  justify-between border-b border-gray-100 py-4`}>
                <Icon type="ionicon" name="location" />
                <View style={tw`ml-4`}>
                  <Text style={[tw`text-gray-600 text-sm`, { fontFamily: "UberMoveMedium" }]}>Pick Up Location</Text>
                  <Text style={[tw`text-gray-500 text-xs`, { fontFamily: "UberMoveMedium" }]}>12:00 AM dropoff</Text>
                </View>
                <Text style={tw`flex-1 text-right  text-blue-500`}>Add or Change</Text>
              </View>

              <View style={tw`flex flex-row justify-between border-b border-gray-100 py-4`}>
                <Icon type="ionicon" name="person" />

                <View style={tw`ml-4`}>
                  <Text style={[tw`text-gray-600 text-sm`, { fontFamily: "UberMoveMedium" }]}>{ride?.currentRate}</Text>
                  <Text style={[tw`text-gray-500 text-xs`, { fontFamily: "UberMoveMedium" }]}> Visa {faker.fake("{{finance.mask}}")}</Text>
                </View>
                <Text style={tw`flex-1 text-right text-blue-500`}>Switch</Text>
              </View>

              <View style={tw`flex flex-row justify-between border-b border-gray-100 py-4`}>
                <Icon type="octicon" brand="solid" name="broadcast" />
                <View style={tw`ml-4`}>
                  <Text style={[tw`text-gray-600 text-sm`, { fontFamily: "UberMoveMedium" }]}>Riding with someone?</Text>
                </View>
                <Text style={tw`flex-1 text-right text-blue-500`}>Split Fare</Text>
              </View>

              <View style={tw`flex flex-row justify-between border-b border-gray-100 py-4`}>
                <Icon type="material" brand="solid" name="mobile-screen-share" />
                <View style={tw`ml-4`}>
                  <Text style={[tw`text-gray-600 text-sm`, { fontFamily: "UberMoveMedium" }]}>Share trip status</Text>
                </View>
                <Text style={tw`flex-1 text-right text-blue-500`}>Share</Text>
              </View>
            </View>
            <ActionButtonGroup />
          </Card>
        </ScrollView>
      </StackBottomSheet>
    </SafeAreaView>
  );
};

export default PickupCard;
