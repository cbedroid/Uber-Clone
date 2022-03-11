import React from "react";
import { Text } from "react-native";
import { ButtonGroup } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const component1 = () => <Text style={tw`text-red-600`}>Cancel</Text>;
const component2 = () => <Text style={tw`text-blue-600`}>Safety</Text>;
const buttons = [{ element: component1 }, { element: component2 }];

const ActionButtonGroup = () => {
  return <ButtonGroup selectedIndex={-1} buttons={buttons} containerStyle={tw`m-0`} />;
};

export default ActionButtonGroup;
