import * as Font from "expo-font";
const useFonts = async () => {
  await Font.loadAsync({
    UberMoveRegular: require("./UberMove-Regular.ttf"),
    UberMoveMedium: require("./UberMove-Medium.ttf"),
    UberTextRegular: require("./UberMoveText-Regular.ttf"),
    UberTextMedium: require("../UberMoveText-Medium.ttf"),
  });
};

export default useFonts;
