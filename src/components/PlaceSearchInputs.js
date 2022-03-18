import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FAB, LinearProgress } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectUserLocation } from "../features/locationSlice";
import { setOrigin, setDestination, selectOrigin, selectDestination } from "../features/navSlice";
import { textEllipsis } from "../Helper";
import { fetchPlacesApi } from "../Utils";
import SearchInput from "./subcomponents/SearchInput";
const _ = require("lodash");

// eslint-disable-next-line react/display-name
const PlaceSearchInputs = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const userLocation = useSelector(selectUserLocation);
  const navigation = useNavigation();
  const [focusedInput, setFocusedInput] = useState(2);
  const [loading, setLoading] = useState(null);
  const inputRef_1 = React.useRef();
  const inputRef_2 = React.useRef();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const route = useRoute();

  useEffect(() => {
    handleInitialLocation();
  }, []);

  React.useImperativeHandle(ref, () => ({
    getFocusedInput() {
      return focusedInput;
    },
  }));

  /**
   * Set user's initial origin from user location or saved point
   *
   */
  const handleInitialLocation = () => {
    dispatch(setOrigin({}));
    dispatch(setDestination({}));
    const savedLocation = route?.params?.savedLocation;
    const userCurrentLocation = userLocation?.fullAddress;

    if (savedLocation) {
      setInitialOrigin(savedLocation);
    } else if (userCurrentLocation) {
      setInitialOrigin(userCurrentLocation);
    }
  };

  /**
   *
   * @param {String} address - address's name of  place
   * @param {*ref} input  - input field ref
   */
  const setAddressToInput = (address, input) => {
    const currentInput = input || focusedInput === 1 ? inputRef_1 : inputRef_2;
    try {
      currentInput.current.setSelectedValue(textEllipsis(address, 130));
    } catch {
      console.error("Input value cannot be set");
    }
  };

  /**
   * Dispatch origin or destination to store
   * params {bool} ignoreState - flag set to ignore local state checks
   */
  React.useImperativeHandle(ref, () => ({
    setOriginDestination(item, ignoreState = false) {
      // Maps current focused input value to either `nearby city's name` or `input field value`
      // ** See searchScreen - handlePress or convertToGeoFormat
      if (!item) return;

      setAddressToInput(item?.name);
      const reduxAction = focusedInput === 1 ? setOrigin : setDestination;
      dispatch(reduxAction(item));
      // Only move to next screen if the second input has a value
      if (ignoreState || (origin && destination)) navigation.navigate("MapScreen");
    },
  }));

  const setInitialOrigin = async (location) => {
    const api_response = await fetchPlacesApi(location);
    if (!api_response || api_response.status !== 200) return;

    const data = api_response?.data?.results[0];
    if (!data) return;
    console.log("\nHandling API Data");
    setAddressToInput(location, inputRef_1);
    dispatch(setOrigin(data));

    // reset origin if destination and origin are the same
    // must use origin and destination from store, because of the additional formatting on reducers
    if (_.isEqual(origin, destination)) dispatch(setDestination({}));
  };

  const getChildFocusedInput = () => {
    const currentFocus = inputRef_1?.current.isFocused() ? 1 : 2;
    setFocusedInput(currentFocus);
  };

  const handleLoadingBar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <View style={tw`p-0`}>
      <View style={tw`flex flex-row px-4 items-center drop-shadow`}>
        <View>
          <View style={tw`${focusedInput === 1 ? "bg-gray-400" : "bg-gray-700"} rounded-full h-2 w-2`}></View>
          <View style={tw`border-gray-400 h-14 border-r w-1`}></View>
          <View style={tw`${focusedInput === 0 ? "bg-gray-400" : "bg-gray-700"}  h-2 w-2`}></View>
        </View>
        <View style={tw`flex-1`}>
          <SearchInput ref={inputRef_1} placeholder="Enter pickup location" onChange={getChildFocusedInput} handleLoading={handleLoadingBar} />
          <SearchInput ref={inputRef_2} placeholder="Where To?" onChange={getChildFocusedInput} handleLoading={handleLoadingBar} />
        </View>
        <FAB icon={{ name: "add", color: "#000" }} size="small" color="#f3f3f3" visible={true} />
      </View>
      <LinearProgress style={[tw`bg-gray-200`, { marginVertical: 6 }]} variant={loading ? "indeterminate" : "determinate"} color="grey" />
    </View>
  );
});

export default PlaceSearchInputs;
