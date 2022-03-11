import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLocation: null,
  nearbyPlaces: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setNearbyPlaces: (state, action) => {
      state.nearbyPlaces = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
});

/// export location Actions
export const { setNearbyPlaces, setUserLocation } = locationSlice.actions;

// export Selectors
export const selectNearbyPlaces = (state) => state.location.nearbyPlaces;
export const selectUserLocation = (state) => state.location.userLocation;

// export locationSlice
export default locationSlice.reducer;
