import { createSlice } from "@reduxjs/toolkit";

const toGeoFormat = (item) => {
  const lat = item?.place?.geometry?.coordinates[1] || item?.lat;
  const lng = item?.place?.geometry?.coordinates[0] || item?.lng;

  return {
    name: item?.name,
    location: {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      latitudeDelta: 0.0005,
      longitudeDelta: 0.0005,
    },
    description: item.displayString,
  };
};
const initialState = {
  origin: null,
  destination: null,
  places: null,
  stops: null,
  travelTimeInformation: null,
  directions: [],
  coordinates: [],
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      const item = action.payload;
      state.origin = toGeoFormat(item);
    },
    setDestination: (state, action) => {
      const item = action.payload;
      state.destination = toGeoFormat(item);
    },
    setPlaces: (state, action) => {
      state.places = action.payload;
    },
    setStops: (state, action) => {
      const item = action.payload;
      const stops = state.stops || [];
      state.stops = [...stops, ...toGeoFormat(item)];
    },

    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
    setDirections: (state, action) => {
      state.directions = action.payload;
    },
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
  },
});

/// export nav actions
export const { setOrigin, setDestination, setPlaces, setStops, setTravelTimeInformation, setDirections, setCoordinates } = navSlice.actions;

// export Selectors
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectPlaces = (state) => state.nav.places;
export const selectDirections = (state) => state.nav.directions;
export const selectStops = (state) => state.nav.stops;
export const selectCoordinates = (state) => state.nav.coordinates;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation;

// export navReducer
export default navSlice.reducer;
