import { createSlice } from "@reduxjs/toolkit";

const filterPlaces = (item) => {
  return {
    name: item.name,
    location: {
      lat: parseFloat(item.place.geometry.coordinates[1]),
      lng: parseFloat(item.place.geometry.coordinates[0]),
      latitudeDelta: 0.0005,
      longitudeDelta: 0.0005,
    },
    description: item.displayString,
  };
};
const initialState = {
  origin: null,
  destination: null,
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
      state.origin = filterPlaces(item);
    },
    setDestination: (state, action) => {
      const item = action.payload;
      state.destination = filterPlaces(item);
    },
    setStops: (state, action) => {
      const item = action.payload;
      const stops = state.stops || [];
      state.stops = [...stops, ...filterPlaces(item)];
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
export const { setOrigin, setDestination, setStops, setTravelTimeInformation, setDirections, setCoordinates } = navSlice.actions;

// export Selectors
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectDirections = (state) => state.nav.directions;
export const selectStops = (state) => state.nav.stops;
export const selectCoordinates = (state) => state.nav.coordinates;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation;

// export navReducer
export default navSlice.reducer;
