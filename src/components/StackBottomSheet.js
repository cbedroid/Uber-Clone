import React from "react";
import { SafeAreaView } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import tw from "tailwind-react-native-classnames";

const StackBottomSheet = (props) => {
  const snapPoints = React.useMemo(() => ["100%"], []);
  const RBRef = React.useRef();
  return (
    <SafeAreaView style={{ ...props?.styles, flex: 1 }}>
      <BottomSheet
        ref={RBRef}
        index={0}
        snapPoints={snapPoints}
        handleStyle={tw`h-12 border-b  border-gray-200`}
        handleIndicatorStyle={tw`bg-gray-300 w-16 h-1`}
      >
        {props.children}
      </BottomSheet>
    </SafeAreaView>
  );
};

export default StackBottomSheet;
