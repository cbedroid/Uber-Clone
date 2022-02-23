import React from "react"
import { Text, View, SafeAreaView } from "react-native"
import tw from "tailwind-react-native-classnames"

const EatsScreen = () => {
  return (
    <SafeAreaView style={tw`bg-black text-white h-full`}>
      <View style={tw`p-12`}>
        <Text style={tw`text-white text-3xl font-bold`}>EatsScreen</Text>
      </View>
    </SafeAreaView>
  )
}

export default EatsScreen
