import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nearbyPlaces: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setNearbyPlaces: (state, action) => {
      state.nearbyPlaces = action.payload;
    },
  },
});

/// export location Actions
export const { setNearbyPlaces } = locationSlice.actions;

// export Selectors
export const selectNearbyPlaces = (state) => state.driver.driver;

// export locationSlice
export default locationSlice.reducer;
