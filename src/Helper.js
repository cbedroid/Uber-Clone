import { Dimensions } from "react-native";

export const textEllipsis = (text, offset = 120) => {
  // Custom text ellipsis style for text input

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
