import React, { useEffect, useState } from "react";
import { Image, Text } from "react-native";
import { View } from "react-native";
import { PropTypes } from "prop-types";

const data = [
  {
    id: "Uber-X-123",
    title: "UberX",
    image: require("../../assets/uber_x_car.webp"),
  },
  {
    id: "Uber-XL-456",
    title: "Uber XL",
    image: require("../../assets/uber_xl_car.webp"),
  },
  {
    id: "Uber-LUX-789",
    title: "Uber LUX",
    image: require("../../assets/uber_lux_car.webp"),
  },
];

const RideImage = ({ car_id, width, height }) => {
  const [image, setImage] = useState(0);

  useEffect(() => {
    const image_index = data.findIndex((img) => img.id === car_id || "");
    if (!image_index) return;
    console.log("Ride Image", image_index);
    setImage(data[image_index]);
  });

  return (
    <View>{image ? <Image style={{ width: width || 100, height: height || 100, resizeMode: "contain" }} source={image?.image} /> : <Text>No image</Text>}</View>
  );
};

export default RideImage;

RideImage.propTypes = {
  car_id: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};
