import React from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import tw from 'tailwind-react-native-classnames'

const MapScreen = () => {
  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-12`}>
        <Text style={tw`text-black text-3xl font-bold`}>MapScreen</Text>
      </View>
    </SafeAreaView>
  )
}

export default MapScreen

const styles = StyleSheet.create({})