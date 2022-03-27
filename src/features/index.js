import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import locationReducer from "./locationSlice";
import navReducer from "./navSlice";
import rideReducer from "./rideSlice";
import userReducer from "./userSlice";

export const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [],
};
export default combineReducers({
  nav: persistReducer(persistConfig, navReducer),
  ride: persistReducer(persistConfig, rideReducer),
  location: persistReducer(persistConfig, locationReducer),
  user: persistReducer(persistConfig, userReducer),
});
