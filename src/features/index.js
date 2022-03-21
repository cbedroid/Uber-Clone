import { combineReducers } from "redux";
import locationReducer from "./locationSlice";
import navReducer from "./navSlice";
import rideReducer from "./rideSlice";
import userReducer from "./userSlice";

export default combineReducers({
  nav: navReducer,
  ride: rideReducer,
  location: locationReducer,
  user: userReducer,
});
