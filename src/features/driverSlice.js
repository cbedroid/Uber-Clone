import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  driver: null,
};

export const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
  },
});

/// export Driver Actions
export const { setDriver } = driverSlice.actions;

// export Selectors
export const selectDriver = (state) => state.driver.driver;

// export DriverReducer
export default driverSlice.reducer;
