/* eslint-disable no-unused-vars */
import { Dimensions } from "react-native";
const _ = require("lodash");

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

/**
 *
 * compare two objects and return difference in keys
 * @param {object} a  object one
 * @param {object} b  object two
 * @returns {array}  array of keys that are different
 */
export const getObjectDiff = (a, b) => {
  _.reduce(
    a,
    function (result, value, key) {
      return _.isEqual(value, b[key]) ? result : result.concat(key);
    },
    []
  );
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
/**
 *
 * @param {Array} arr - Array item list.
 * @param {String} key -  Key to sort array by.
 * @returns {Array} - Sorted array
 */
export const randomizeArray = (arr, key = null) => {
  try {
    // if keys not supplied,then get a random object key from array
    if (arr && typeof arr[0] === "object") {
      const obj_keys = Object.keys(arr[0]);
      const random_key = Math.floor(Math.random() * obj_keys.length);
      key = key || obj_keys[random_key];
    }
    arr = _.sortBy(arr, (x) => x[key]);
  } catch (e) {
    console.error("RandomizeArray Error", e);
  }

  return arr;
};

export const humanPhoneNumber = (number) => {
  if (!number) return;
  try {
    const reExp = new RegExp(/(\d*)(\d{3})(\d{3})(\d{4})/g);
    const [__, ext, areaCode, fn, ln] = reExp.exec(number);
    return `+${ext} (${areaCode})-${fn}-${ln}`;
  } catch {
    return number;
  }
};
