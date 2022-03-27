import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Dialog, Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectUser } from "../../features/userSlice";
import { humanPhoneNumber } from "../../Helper";

const SignInScreen = ({ navigation }) => {
  const user = useSelector(selectUser);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log("SignIn loaded");
  }, []);

  useEffect(() => {
    console.log({ user });
    /**
     * Temporary solution to `navigate screens` while component mounts
     * TODO: fix issue navigating  before component mounts
     */
    setTimeout(() => {
      if (!user?.phoneNumber || !user?.phoneNumberVerified) return navigation.navigate("PhoneRegisterScreen");
      setIsVisible(true);
    }, 800);
  });
  return (
    <SafeAreaView style={tw`bg-gray-50 flex-1`}>
      <View style={tw`flex flex-row items-center h-14 `}>
        <Dialog isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
          {!user?.phoneNumber ? (
            <Dialog.Loading size="large" />
          ) : (
            <>
              <Dialog.Title title="Continue With" titleStyle={[tw`text-base text-gray-400 font-semibold`, { fontFamily: "VisbySemibold" }]} />
              <TouchableOpacity style={tw`flex flex-row items-center content-between py-2 `}>
                <Icon
                  type="material-icons"
                  name="phone"
                  size={24}
                  color="white"
                  containerStyle={tw`bg-gray-200 w-10 h-10 rounded-full mr-4`}
                  style={tw`m-auto`}
                />
                <Text style={[tw`flex-1 text-lg`, { fontFamily: "UberTextRegular" }]}>{humanPhoneNumber(user.phoneNumber)}</Text>
              </TouchableOpacity>
              <View style={tw`flex items-start px-8 z-50`}>
                <Dialog.Actions>
                  <Dialog.Button
                    title="None of the Above"
                    titleStyle={[tw`uppercase text-blue-500`, { fontFamily: "VisbySemibold" }]}
                    onPress={() => navigation.navigate("PhoneRegisterScreen")}
                  />
                </Dialog.Actions>
              </View>
            </>
          )}
        </Dialog>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
