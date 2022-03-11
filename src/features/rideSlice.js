import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  driver: null,
  ride: null,
};

export const RideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
    setRide: (state, action) => {
      state.ride = action.payload;
    },
  },
});

/// export Driver Actions
export const { setDriver, setRide } = RideSlice.actions;

// export Selectors
export const selectDriver = (state) => state.ride.driver;
export const selectRide = (state) => state.ride.ride;

// export DriverReducer
export default RideSlice.reducer;
