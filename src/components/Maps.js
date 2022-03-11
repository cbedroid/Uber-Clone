import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectOrigin, selectDestination, selectCoordinates } from "../features/navSlice";

const Maps = (props) => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const coordinates = useSelector(selectCoordinates);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    console.log("\nMaps loaded");
    if (!origin || !destination) return;
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={([tw`relative flex-1`], { ...styles.map })}
        mapType="mutedStandard"
        loadingEnabled={true}
        initialRegion={{
          latitude: origin?.location.lat,
          longitude: origin?.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {destination && origin && coordinates && (
          <Polyline
            ref={polylineRef}
            coordinates={coordinates}
            origin={origin.description}
            destination={destination.description}
            strokeWidth={3}
            strokeColor={"#000"}
          />
        )}

        {origin && destination && (
          <View>
            <Marker
              title="Starting"
              description={origin.description}
              identifier="origin"
              coordinate={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
              }}
            />
            <Marker
              title="Destination"
              description={destination.description}
              identifier="destination"
              coordinate={{
                latitude: destination.location.lat,
                longitude: destination.location.lng,
              }}
            />
          </View>
        )}
      </MapView>
      {/* OverlayComponent */}
      {props.overlay && <TouchableOpacity style={styles.overlay}></TouchableOpacity>}
    </View>
  );
};

export default Maps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    display: "flex",
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0, 0, 0, .4)",
  },
});
