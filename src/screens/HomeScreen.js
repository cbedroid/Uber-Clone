import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { View, SafeAreaView, Image } from "react-native"
import tw from "tailwind-react-native-classnames"
import NavOptions from "../components/NavOptions";

import { setDestination, setOrigin, selectOrigin } from "../features/navSlice"
import MapQuestAutoComplete from "../components/MapQuestAutoComplete";
import NavFavourites from "../components/NavFavourites";


const HomeScreen = () => {
  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const dropDownRef = React.createRef()

  useEffect(() => {
    console.log("HomeScreen loaded")
  }, [])

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
        style={tw`p-1 w-full`}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => { dropDownRef.current.hideDropDown() }}
      >
        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={{ uri: "https://links.papareact.com/gzs" }}
        />
        <MapQuestAutoComplete
          ref={dropDownRef}
          placeholder={"Where From?"}
          handleSubmit={(data) => submitOrigin(data)}
          locationProp={origin}
        />
        <NavOptions />
        <NavFavourites />
      </View>
    </SafeAreaView>
  )
}
export default HomeScreen
