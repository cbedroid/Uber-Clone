import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
  travelTimeInformation: null,
  directions: [],
  coordinates: [],
}



export const navSlice = createSlice({

  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
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
})

/// export nav actions
export const { setOrigin, setDestination, setTravelTimeInformation, setDirections, setCoordinates } = navSlice.actions;

// export Selectors
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectDirections = (state) => state.nav.directions;
export const selectCoordinates = (state) => state.nav.coordinates;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation;

// export navReducer
export default navSlice.reducer