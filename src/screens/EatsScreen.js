import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FAB } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const EatsScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={tw`bg-black text-white h-full`}>
      <FAB
        onPress={() => navigation.navigate("HomeScreen")}
        visible={true}
        icon={{ name: "arrow-back", color: "#000" }}
        size="small"
        color="white"
        style={tw`absolute top-20 left-10 bg-red-400`}
      />
      <View style={tw`flex justify-center p-12 h-full`}>
        <Text style={tw`text-white text-center text-4xl font-bold`}>Uber Eats</Text>
        <Text style={tw`text-blue-600 text-center text-3xl font-bold mt-4`}>Coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

export default EatsScreen;
