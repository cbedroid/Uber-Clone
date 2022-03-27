import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    uid: null,
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    phoneNumber: null,
    emailVerified: false,
    phoneNumberVerified: false,
    isLoggedIn: false,
    lastLoginAt: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    resetUser: (state) => {
      state.user = initialState;
    },
  },
});

/// export User Actions
export const { setUser, resetUser } = userSlice.actions;

// export Selectors
export const selectUser = (state) => state.user.user;
export const selectFullName = (state) => `${state.user.user.firstName} ${state.user.user.lastName}`;

// export UserReducer
export default userSlice.reducer;
