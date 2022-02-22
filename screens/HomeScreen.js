import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import tw from "tailwind-react-native-classnames"
import NavOptions from '../components/NavOptions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// https://github.com/FaridSafi/react-native-google-places-autocomplete

import { GOOGLE_MAPS_APIKEY } from '@env'


const HomeScreen = () => {
  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{ width: 100, height: 100, resizeMode: 'contain' }}
          source={{ uri: "https://links.papareact.com/gzs" }}
        />
        <GooglePlacesAutocomplete

          enablePoweredByContainer={false}
          minLength={2}
          placeholder="Where From?"
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          fetchDetails={true}
          returnKeyType={"search"}

          onPress={(data, details = null) => {
            console.log("data", data, "\ndetails", details)
          }}
          onFail={(e) => console.log("Error", e)}
          onNotFound={(nf) => console.log("Not Found", nf)}

          query={{ key: GOOGLE_MAPS_APIKEY, language: "en" }}
          styles={{
            container: { flex: 0 },
            textInput: { fontSize: 18 }
          }}
        />
        <NavOptions />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
})