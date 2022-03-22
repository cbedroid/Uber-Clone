import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { requestUserLocationPermission } from "../Utils";
const UberLogo = require("../assets/uber_logo_white.webp");

const LoadingScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const scaleAnimation = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 350,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  });

  useEffect(async () => {
    console.log("App loading");
    await requestUserLocationPermission();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) navigation.navigate("SafetyScreen");
  }, [loading]);

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              scale: scaleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={tw`bg-black text-white flex content-center items-center w-full h-full`}>
        <Image style={[tw`my-auto`, { width: 150, height: 200, resizeMode: "contain" }]} source={UberLogo} />
      </View>
    </Animated.View>
  );
};

export default LoadingScreen;
