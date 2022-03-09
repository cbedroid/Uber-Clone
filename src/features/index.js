import { combineReducers } from "redux";
import driverReducer from "./driverSlice";
import locationReducer from "./locationSlice";
import navReducer from "./navSlice";

export default combineReducers({
  nav: navReducer,
  driver: driverReducer,
  location: locationReducer,
});
