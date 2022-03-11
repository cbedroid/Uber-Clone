import { combineReducers } from "redux";
import locationReducer from "./locationSlice";
import navReducer from "./navSlice";
import rideSlice from "./rideSlice";

export default combineReducers({
  nav: navReducer,
  ride: rideSlice,
  location: locationReducer,
});
