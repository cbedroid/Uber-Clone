import React from "react"
import MapView, { Marker } from "react-native-maps"
import tw from "tailwind-react-native-classnames"
import { useSelector } from "react-redux"
import { selectOrigin } from "../store/slices/navSlice"


const Maps = () => {
  const origin = useSelector(selectOrigin)
  return (
    <MapView
      style={tw`flex-1`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: origin?.location.lat || 37.78825,
        longitude: origin?.location.lng || -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
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
