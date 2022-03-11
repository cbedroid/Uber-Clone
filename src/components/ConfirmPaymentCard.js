import React from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Col, Grid } from "react-native-easy-grid";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import ConfirmPaymentSvg from "../assets/confirm_payment.svg";
import { selectRide } from "../features/rideSlice";
import StackBottomSheet from "./StackBottomSheet";

const ConfirmPaymentCard = () => {
  const navigation = useNavigation();
  const ride = useSelector(selectRide);

  return (
    <SafeAreaView style={tw`flex flex-1`}>
      <StackBottomSheet>
        <View style={tw`flex-1 bg-white p-6 w-full`}>
          <Grid style={tw`pt-1`}>
            <Col size={2}>
              <Text style={[tw`text-2xl text-gray-700 pb-1`, { fontFamily: "UberTextRegular" }]}>Confirm your fare</Text>
              <Text style={tw`text-gray-700 text-2xl font-bold tracking-tighter mb-3`}>{ride?.currentRate}</Text>
              <Text style={[tw`text-sm text-gray-500 mb-1`, { fontFamily: "UberTextRegular" }]}>Fare are a lot higher due to increased demands</Text>
            </Col>
            <Col size={1}>
              <ConfirmPaymentSvg width={120} height={135} fill="#000" />
            </Col>
          </Grid>
          <TouchableOpacity onPress={() => navigation.navigate("PickupCard")} style={tw`bg-black mt-auto py-2`}>
            <Text style={tw`text-gray-50 text-sm uppercase text-center py-1`}>Confirm Fare</Text>
          </TouchableOpacity>
        </View>
      </StackBottomSheet>
    </SafeAreaView>
  );
};

export default ConfirmPaymentCard;
