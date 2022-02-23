import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setDestination } from "../store/slices/navSlice"
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import tw from 'tailwind-react-native-classnames'
import { GOOGLE_MAPS_APIKEY } from '@env';


const NavigateCard = () => {
  const dispatch = useDispatch()
  const [greetingMessage, setGreetingMessage] = useState("Good Mourning")
  const [googleErrors, setGoogleError] = useState(null)

  useEffect(() => {
    getDayTimeStatus()
  })

  const getDayTimeStatus = () => {
    const now = new Date().getHours() // 24hr time format
    const greeting_msg = now >= 12 && now < 18 ? "Good Afternoon" : now >= 18 && now < 24 ? "Good Evening" : "Good Mourning"
    setGreetingMessage(greeting_msg)
  }
  const handleOnPress = (data, details = null) => {
    console.log("data", data, "\ndetails", details)

    // get user input, call google api, save location
    dispatch(setDestination(
      {
        location: details.geometry.location,
        description: data.description
      }
    ))
    // reset `googleErrors` and `origin`for new incoming data 
    dispatch(setOrigin(null))
    setGoogleError(null)
  }

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Text style={tw`text-center py-5 text-xl font-semibold`}>{greetingMessage}</Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}></View>
      <View>
        <GooglePlacesAutocomplete
          placeholder="Where to?"
          styles={toInputBoxStyles}
          fetchDetails={true}
          enablePoweredByContainer={false}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          onPress={(data, details = null) => handleOnPress(data, details)}
          onFail={setGoogleError}
          onNotFound={setGoogleError}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en"
          }}
        />
        {googleErrors && (
          <Text className="errors" style={tw`text-red-400 py-4 px-6`}>{googleErrors}</Text>
        )
        }
      </View>
    </SafeAreaView>
  )
}

export default NavigateCard

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    backgroundColor: "#DDDDDF",
    borderRadius: 0,
    fontSize: 18
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0
  }
})