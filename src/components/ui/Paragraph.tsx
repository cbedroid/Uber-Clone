import React, { ReactNode } from "react";

import { Text } from "react-native";

import tw from "twrnc";

type Props = {
  children: ReactNode;
  spacing?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
};

const Paragraph = ({ children, spacing = "normal" }: Props) => {
  return (
    <Text
      style={tw.style(`text-sm text-gray-500`, {
        [`leading-{spacing}`]: !!spacing,
      })}
    >
      {children}
    </Text>
  );
};

export default Paragraph;
