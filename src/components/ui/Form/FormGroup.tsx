import React, { ReactNode } from "react";

import { View } from "react-native";

import tw from "twrnc";

type Props = {
  children: ReactNode;
  isText?: boolean;
  isFocus?: boolean;
  hasSelect?: boolean;
  hasError?: boolean;
};

const FormGroup = ({
  children,
  isText = false,
  isFocus = false,
  hasSelect = false,
  hasError = false,
}: Props) => {
  return (
    <View
      style={tw.style(`flex flex-row items-center content-between`, {
        "bg-gray-200 w-54 h-14 p-1": isText,
        "h-14 mx-1 px-1": hasSelect,
        "border border-red-400": (isText || hasSelect) && hasError,
        "border-2 border-black dark:border-gray-100":
          (isText || hasSelect) && isFocus && !hasError,
      })}
    >
      {children}
    </View>
  );
};

export default FormGroup;
