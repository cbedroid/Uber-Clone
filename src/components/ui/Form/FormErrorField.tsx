import React from "react";

import { Text } from "react-native";

import tw from "twrnc";

type Props = {
  error: string | undefined;
  styles?: string;
};

const FormErrorField = ({ error, styles }: Props) => {
  return (
    <>
      {error && (
        <Text
          style={tw.style(`text-red-600 text-right`, {
            [styles!]: !!styles,
          })}
        >
          {error}
        </Text>
      )}
    </>
  );
};

export default FormErrorField;
