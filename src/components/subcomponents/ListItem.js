import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PropTypes } from "prop-types";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { textEllipsis } from "../../Helper";

const ListItem = (props) => {
  return (
    <TouchableOpacity onPress={props?.handlePress} style={tw`flex flex-row items-center border-b border-gray-200 p-3 `}>
      <Icon
        type={props?.icon?.type}
        name={props?.icon?.name}
        size={24}
        color="white"
        containerStyle={tw`bg-gray-400 w-10 h-10 rounded-full mx-4`}
        style={tw`m-auto`}
      />
      <View style={tw`flex-1`}>
        <Text style={[tw`text-lg`, { fontFamily: "UberTextRegular" }]}>{props?.title}</Text>
        {props?.subtitle && <Text style={tw`text-gray-400`}>{textEllipsis(props?.subtitle)}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

ListItem.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.object,
  handlePress: PropTypes.func,
  fill: PropTypes.bool,
};

ListItem.defaultProps = {
  title: "Save Place",
  icon: { type: "material", name: "location-pin" },
  fill: true,
};
