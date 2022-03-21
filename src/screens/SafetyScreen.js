import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";

const SafetyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, ...styles.container }}>
      <View style={tw`flex mt-12`}>
        <Text style={[tw`text-white text-center py-4`, { fontFamily: "UberMoveMedium", fontSize: 48 }]}>Uber</Text>
        <View style={tw`mx-auto my-8`}>
          <Image style={[{ width: 200, height: 200, resizeMode: "contain" }]} source={require("../assets/driver_rider_mask.webp")} />
        </View>
        <Text style={[tw`text-white text-center py-4`, { fontFamily: "UberMoveMedium", fontSize: 40 }]}>Move with Safety</Text>
      </View>
      <View style={tw`flex-1 mx-4`}>
        <Button
          title="Get Started"
          color="#000"
          containerStyle={tw`mt-auto mb-12`}
          buttonStyle={tw`bg-black text-white p-4`}
          titleStyle={[tw`flex-1 text-xl font-bold`]}
          onPress={() => {
            navigation.navigate("AccountSetupScreen");
          }}
          icon={{
            name: "arrow-right",
            type: "fontisto",
            size: 24,
            color: "white",
          }}
          iconRight
        />
      </View>
    </SafeAreaView>
  );
};

export default SafetyScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#276EF1",
  },
});
