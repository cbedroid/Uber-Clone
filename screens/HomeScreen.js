import React from "react"
import { useDispatch } from "react-redux"
import { View, SafeAreaView, Image } from "react-native"
import tw from "tailwind-react-native-classnames"
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"; // https://github.com/FaridSafi/react-native-google-places-autocomplete
import { setDestination, setOrigin } from "../store/slices/navSlice"

// eslint-disable-next-line import/no-unresolved
import { GOOGLE_MAPS_APIKEY } from "@env"


const HomeScreen = () => {
  const dispatch = useDispatch()


  const handleOnPress = (data, details = null) => {
    console.log("data", data, "\ndetails", details)
    // get user input, call google api, save location
    dispatch(setOrigin(
      {
        location: details.geometry.location,
        description: data.description
      }
    ))
    // reset destination for new data 
    dispatch(setDestination(null))
  }

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
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

          onPress={(data, details = null) => handleOnPress(data, details)}
          onFail={(e) => console.log("Error", e)}
          onNotFound={(nf) => console.log("Not Found", nf)}

          query={{ key: GOOGLE_MAPS_APIKEY, language: "en" }}
          styles={{
            container: { flex: 0 },
            textInput: { fontSize: 18, fontWeight: "600" }
          }}
        />
        <NavOptions />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
