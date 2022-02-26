import { combineReducers } from "redux";
import navReducer from "./navSlice"


export default combineReducers({
  nav: navReducer,
})