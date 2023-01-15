import React, { ReactNode } from "react";

import { Text } from "react-native";

// @ts-ignore
import styled from "styled-components/native";
import tw from "twrnc";

export const Hero = styled.View`
  margin-bottom: 12px;
`;
Hero.displayName = "Hero";

type Props = {
  children: ReactNode;
};
export const HeroHeader = ({ children }: Props) => (
  <Text style={tw`text-lg text-gray-800 dark:text-gray-50 `}>{children}</Text>
);
