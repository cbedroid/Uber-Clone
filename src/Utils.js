import { Platform } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { MAPQUEST_APIKEY } from "@env";
import axios from "axios";
import Constants from "expo-constants";
import * as Font from "expo-font";
import * as Location from "expo-location";
import { setUserLocation, setNearbyPlaces } from "./features/locationSlice";
import store from "./store/index";
const _ = require("lodash");

/**
 * Load fonts for App
 * @returns
 */
export const loadFont = async () =>
  Font.loadAsync({
    UberMoveRegular: require("./assets/fonts/UberMove-Regular.ttf"),
    UberMoveMedium: require("./assets/fonts/UberMove-Medium.ttf"),
    UberTextRegular: require("./assets/fonts/UberMoveText-Regular.ttf"),
    VisbySemibold: require("./assets/fonts/VisbySemibold.ttf"),
    VisbyRegular: require("./assets/fonts/VisbyRegular.ttf"),
    VisbyMedium: require("./assets/fonts/VisbyMedium.ttf"),
    VisbyLight: require("./assets/fonts/VisbyLight.ttf"),
    VisbyThin: require("./assets/fonts/VisbyThin.ttf"),
    VisbyThinItalic: require("./assets/fonts/VisbyThinItalic.ttf"),
  });

/**
 * Request user current location
 * @returns
 */
export const requestUserLocationPermission = async () => {
  if (Platform.OS === "android" && !Constants.isDevice) {
    alert("Oops, this will not work on Snack in an Android emulator. Try it on your device!");
    return;
  }
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return;

  // Requesting user location permissions
  let location = null;
  try {
    console.log("\nRequesting user location permissions ...");
    location = await Location.getCurrentPositionAsync({ accuracy: 5 });
  } catch {
    console.log("\nUserLocationRequest: denied");
  }

  // If location permission is granted, then get user's current location
  if (!_.isEmpty(location)) {
    const nearbyPlacesResponse = await fetchNearbyPlaces(location);
    const userAddressResponse = await fetchUserAddress(location);

    if (nearbyPlacesResponse.status === 200 || userAddressResponse.status === 200) {
      store.dispatch(setNearbyPlaces(nearbyPlacesResponse.data.searchResults));
      store.dispatch(setUserLocation(userAddressResponse.data.results[0].locations[0]));
    }
  }
};

/**
 * Fetch nearby places for a given location
 * @param {string} location
 * @returns
 */
export const fetchNearbyPlaces = async (location) => {
  const lat = location?.coords?.latitude;
  const lon = location?.coords?.longitude;

  const baseURL = "http://www.mapquestapi.com/search/v2/radius";

  const api_resp = await axios({
    baseURL: baseURL,
    method: "GET",
    params: {
      maxMatches: 10,
      origin: `${lat},${lon}`,
      key: MAPQUEST_APIKEY,
    },
    responseType: "json",
  });

  return api_resp;
};

/**
 * Fetch geo details for given place from MapQuest API
 * @param {string} search  - user's search query
 * @returns
 */

export const fetchPlacesApi = async (search) => {
  if (!search) return;
  const mapQuestURL = "https://web.mapquestapi.com/search/v3/prediction";
  try {
    const api_resp = await axios({
      baseURL: mapQuestURL,
      method: "GET",
      params: {
        collection: "address,adminArea,airport,category,franchise,poi",
        feedback: true,
        key: MAPQUEST_APIKEY,
        limit: 15,
        q: search,
      },
      responseType: "json",
    });
    return await api_resp;
  } catch (error) {
    // setErrorMsg("Sorry, we could not find this place!");
    console.error("Error", error);
  }
};

/**
 * Fetches place coordinates data from MapQuest API
 * @param {string} origin
 * @param {string} destination
 * @returns  {Promise<any>} Mapquest API response
 */

export const fetchDirectionalApi = async (origin, destination = {}) => {
  const mapQuestDirectionalUrl = "http://www.mapquestapi.com/directions/v2/route";
  try {
    const api_resp = await axios({
      baseURL: mapQuestDirectionalUrl,
      method: "GET",
      params: {
        to: origin,
        from: destination,
        unit: "m",
        key: MAPQUEST_APIKEY,
      },
      responseType: "json",
    });
    return api_resp;
  } catch (error) {
    console.error("Directional Api Error", error);
  }
};

/**
 *  Fetches the user's address from the MapQuest API
 * @param {string} location
 * @returns
 */
export const fetchUserAddress = async (location) => {
  const lat = location?.coords?.latitude;
  const lon = location?.coords?.longitude;
  const baseURL = "http://www.mapquestapi.com/geocoding/v1/reverse";

  const api_resp = await axios({
    baseURL: baseURL,
    method: "GET",
    params: {
      location: `${lat},${lon}`,
      key: MAPQUEST_APIKEY,
    },
    responseType: "json",
  });

  return api_resp;
};

/**
 * Preps and converts location data into store geo format.
 * See feature/NavSlice `toGeoFormat` method.
 *
 *  @params {object} item - nearby city location data.
 *
 **/
export const convertToGeoFormat = (item) => {
  const fullAddress = item?.fields ? `${item?.fields.address}, ${item?.fields.city}, ${item?.fields.state}` : item?.displayString;
  return {
    name: item?.fields?.address,
    lat: parseFloat(item?.fields?.lat),
    lng: parseFloat(item?.fields?.lng),
    displayString: fullAddress,
  };
};
