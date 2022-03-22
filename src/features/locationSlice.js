import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLocation: null,
  nearbyPlaces: null,
  savedPlaces: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setNearbyPlaces: (state, action) => {
      state.nearbyPlaces = action.payload;
    },
    setUserLocation: (state, action) => {
      const location = action.payload;
      const fullAddress = `${location.street}, ${location.adminArea5}, ${location.adminArea3}`;
      state.userLocation = { ...location, fullAddress };
    },

    setSavedPlaces: (state, action) => {
      const location = action.payload;
      const fullAddress = `${location.street}, ${location.adminArea5}, ${location.adminArea3}`;
      state.savedPlaces = { ...location, fullAddress };
    },
  },
});

/// export location Actions
export const { setNearbyPlaces, setUserLocation } = locationSlice.actions;

// export Selectors
export const selectNearbyPlaces = (state) => state.location.nearbyPlaces;
export const selectSavedPlaces = (state) => state.location.savedPlaces;
export const selectUserLocation = (state) => state.location.userLocation;

// export locationSlice
export default locationSlice.reducer;
