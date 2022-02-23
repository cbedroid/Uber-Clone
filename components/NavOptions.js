import React from 'react'
import { Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import tw from "tailwind-react-native-classnames"
import { Icon } from "react-native-elements"
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectOrigin } from '../store/slices/navSlice'



const data = [
  {
    id: "123",
    title: "Get a ride",
    image: "https://links.papareact.com/3pn",
    screen: "MapScreen"
  },
  {
    id: "456",
    title: "Order food",
    image: "https://links.papareact.com/28w",
    screen: "EatsScreen"
  }
]

const NavOptions = () => {
  const navigation = useNavigation()
  const origin = useSelector(selectOrigin)
  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          disabled={!origin}
          onPress={() => navigation.navigate(item.screen)}
          style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40 ${!origin && "opacity-30 "}`}>
          <Image
            style={{ width: 120, height: 120, resizeMode: 'contain' }}
            source={{ uri: item.image }}
          />
          <Text style={tw`mt-2 text-lg font-bold`}>{item.title}</Text>
          <Icon style={tw`p-2 bg-black rounded-full w-10 mt-4`} name="arrowright" color="white" type="antdesign" />
        </TouchableOpacity>
      )}
    />
  );
};

export default NavOptions;
