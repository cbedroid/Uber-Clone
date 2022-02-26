import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { View, SafeAreaView, Image } from "react-native"
import tw from "tailwind-react-native-classnames"
import NavOptions from "../components/NavOptions";

import { setDestination, setOrigin, selectOrigin } from "../features/navSlice"
import MapQuestAutoComplete from "../components/MapQuestAutoComplete";


const HomeScreen = () => {
  const dispatch = useDispatch()
  const dropDownRef = React.createRef()
  const origin = useSelector(selectOrigin)

  useEffect(() => {
    console.log("HomeScreen loaded")
  })

  const submitOrigin = (results) => {
    if (!results) return

    dispatch(setOrigin(
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
    )
    )
    // reset destination for new results 
    dispatch(setDestination(null))
  }

  return (
    <SafeAreaView style={tw`bg-white h-full`} >
      <View
        style={tw`p-5 w-full h-full`}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => { dropDownRef.current.hideDropDown() }}
      >
        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={{ uri: "https://links.papareact.com/gzs" }}
        />
        <MapQuestAutoComplete
          ref={dropDownRef}
          placeholder={"Where to?"}
          handleSubmit={(data) => submitOrigin(data)}
          refState={origin}
        />
        <NavOptions />
      </View>
    </SafeAreaView>
  )
}
export default HomeScreen
