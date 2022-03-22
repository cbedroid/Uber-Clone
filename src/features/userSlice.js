import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    phoneNumber: null,
    phoneNumberVerified: false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

/// export User Actions
export const { setUser } = userSlice.actions;

// export Selectors
export const selectUser = (state) => state.user.user;

// export UserReducer
export default userSlice.reducer;
