import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Icon, BottomSheet } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import ConfirmPaymentSvg from "../assets/confirm_payment.svg";
import Maps from "./Maps";

const ConfirmPaymentOptions = ({ route }) => {
  const navigation = useNavigation();
  const [windowY, setWindowY] = useState(100);

  React.useEffect(() => {
    const windowHeight = window.innerHeight;
    setWindowY(windowHeight);
  }, []);

  return (
    <View style={tw`flex h-full`}>
      <Maps />

      <BottomSheet isVisible={true} fullscreen={true}>
        <View style={tw`flex-1 bg-white p-4 w-full h-1/5`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("NavigateCard")}
            style={tw`flex flex-row items-center justify-center border-b border-gray-200 pb-2`}
          >
            <Icon name="arrow-back" size={24} />
            <Text style={tw`text-lg font-bold ml-4`}>Back</Text>
          </TouchableOpacity>
          <Grid style={tw`pt-1`}>
            <Col size={2}>
              <Text style={[tw`text-xl text-gray-800`, { fontFamily: "UberTextRegular" }]}>Confirm your payment</Text>
              <Text style={tw`text-gray-700 text-2xl font-bold tracking-tighter mb-3`}>
                {route?.params?.currentRate}
              </Text>
              <Text style={[tw`text-gray-700 mb-1`, { fontFamily: "UberTextRegular" }]}>
                Fare are a lot higher due to increased demands
              </Text>
            </Col>
            <Col size={1}>
              <ConfirmPaymentSvg width={120} height={135} fill="#000" />
            </Col>
          </Grid>
          <TouchableOpacity
            onPress={() => navigation.navigate("PaymentScreen")}
            style={tw`bg-black mt-auto py-2`}
            // disabled={!selected}
          >
            <Text style={tw`text-gray-50 text-sm uppercase text-center py-1`}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          onPress={() => console.log("pressed")}
          style={[tw`bg-gray-200 absolute left-8  p-2 rounded-full shadow-lg`, { top: -550, zIndex: 400 }]}
        >
          <Icon name="arrow-back" />
        </TouchableOpacity> */}
      </BottomSheet>
    </View>
  );
};

export default ConfirmPaymentOptions;
