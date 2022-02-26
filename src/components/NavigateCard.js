import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setDestination, selectDestination } from "../features/navSlice"
import { Text, View, SafeAreaView } from "react-native"
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import tw from "tailwind-react-native-classnames"
// eslint-disable-next-line import/no-unresolved
import { useNavigation } from "@react-navigation/native"
import MapQuestAutoComplete from "./MapQuestAutoComplete";

const NavigateCard = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [greetingMessage, setGreetingMessage] = useState("Good Mourning")
  const destination = useSelector(selectDestination)

  const dropDownRef = React.createRef()

  useEffect(() => {
    getDayTimeStatus()
    console.log("Navigation loaded")
  })

  const getDayTimeStatus = () => {
    const now = new Date().getHours() // 24hr time format
    const greeting_msg = now >= 12 && now < 18 ? "Good Afternoon" : now >= 18 && now < 24 ? "Good Evening" : "Good Mourning"
    setGreetingMessage(greeting_msg)
  }
  const handleOnPress = (results) => {
    if (!results) return

    dispatch(setDestination(
      {
        name: results.name,
        location: {
          lat: parseFloat(results.place.geometry.coordinates[1]),
          lng: parseFloat(results.place.geometry.coordinates[0]),
          latitudeDelta: 0.0005,
          longitudeDelta: 0.0005
        },
        description: results.displayString
      }
    ))
    // navigate to RideScreen
    navigation.navigate("RideOptionsCard")
  }

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Text style={tw`text-center py-5 text-xl font-semibold`}>{greetingMessage}</Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}></View>
      <View>
        <MapQuestAutoComplete
          ref={dropDownRef}
          placeholder={"Where f rom?"}
          handleSubmit={(data) => handleOnPress(data)}
          refState={destination}

        />
      </View>
    </SafeAreaView>
  )
}

export default NavigateCard

