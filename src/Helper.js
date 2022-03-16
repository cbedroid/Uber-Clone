import { Dimensions } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { MAPQUEST_APIKEY } from "@env";
import axios from "axios";

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
export const textEllipsis = (text, offset = 120) => {
  // Custom text ellipsis style for text input

  if (!text) return text;
  const window_width = Dimensions.get("screen").width - offset;
  text = text.trim();
  const CHAR_SIZE = 8; // font size
  const maxCharacters = (window_width / CHAR_SIZE).toFixed(0);
  const text_length = text.length * CHAR_SIZE;
  return text_length > window_width ? text.slice(0, maxCharacters) + " ..." : text;
};

export const toTitleCase = (...str) => {
  str = str.join(" ");
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
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

export const fetchUserAddress = async (location) => {
  console.log("Fetching User Address ");
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
