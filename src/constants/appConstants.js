import AccountRegisterScreen from "../screens/Accounts/AccountRegisterScreen";
import EatsScreen from "../screens/EatsScreen";
import HomeScreen from "../screens/HomeScreen";
import LoadingScreen from "../screens/LoadingScreen";
import MapScreen from "../screens/MapScreen";
import PickupTimeScreen from "../screens/PickupTimeScreen";
import SafetyScreen from "../screens/SafetyScreen";
import SearchScreen from "../screens/SearchScreen";

export const APP_SCREENS = [
  {
    name: "LoadingScreen",
    component: LoadingScreen,
  },

  {
    name: "SafetyScreen",
    component: SafetyScreen,
  },
  {
    name: "AccountRegisterScreen",
    component: AccountRegisterScreen,
  },
  {
    name: "HomeScreen",
    component: HomeScreen,
  },

  {
    name: "MapScreen",
    component: MapScreen,
  },

  {
    name: "EatsScreen",
    component: EatsScreen,
  },

  {
    name: "PickupTimeScreen",
    component: PickupTimeScreen,
  },
  {
    name: "SearchScreen",
    component: SearchScreen,
  },
];
