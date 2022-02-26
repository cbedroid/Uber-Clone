import React, { useEffect } from "react"
import MapView, { Marker } from "react-native-maps"
import tw from "tailwind-react-native-classnames"
import { useSelector } from "react-redux"
import { selectOrigin, selectDestination } from "../features/navSlice"


const Maps = () => {
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)


  useEffect(() => {
    console.log("MapScreen loaded")
  })
  return (
    <MapView
      style={tw`flex-1`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: origin?.location.lat || 37.78825,
        longitude: origin?.location.lng || -122.4324,
        latitudeDelta: 2.0922,
        longitudeDelta: 2.0421,
      }}
    >
      {origin?.location && (
        <Marker
          title="Place"
          description={origin.description}
          identifier="origin"
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng
          }}
        >
        </Marker>)}
    </MapView>
  )
}

export default Maps
