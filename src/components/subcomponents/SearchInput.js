import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PropTypes } from "prop-types";
import { FAB, LinearProgress } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectUserLocation } from "../../features/locationSlice";
import { setOrigin, setDestination, selectDestination } from "../../features/navSlice";
import { fetchPlacesApi } from "../../Helper";
const _ = require("lodash");

// eslint-disable-next-line react/display-name
const SearchInput = React.forwardRef(({ handleData }, ref) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userLocation = useSelector(selectUserLocation);
  const destination = useSelector(selectDestination);
  const inputRef_1 = React.useRef();
  const inputRef_2 = React.useRef();
  // eslint-disable-next-line no-unused-vars
  const [inputValue_1, setInputValue_1] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [inputValue_2, setInputValue_2] = useState(null);
  const [lastValue, setLastValue] = useState(null);
  const [focusedInput, setFocusedInput] = useState((userLocation?.street && 1) || 0);
  const [loading, setLoading] = useState(null);
  const [apiResults, setApiResults] = useState(null);

  /* Dispatch origin or destination to store*/
  React.useImperativeHandle(ref, () => ({
    setOriginDestination(item) {
      if (!apiResults) return;
      const action = focusedInput === 0 ? setOrigin : setDestination;

      dispatch(action(item));
      //TODO: Navigate if destination is set, then navigate to MapScreen
      if (destination) navigation.navigate("MapScreen");
    },
  }));
  const handleTextChange = async (input) => {
    input = input.toLowerCase().trim();
    if (input.length < 6) return;

    // Prevents recalling fetchData when user is either backspacing
    // or results are already available from previous search
    if (lastValue && lastValue.toLowerCase().startsWith(input)) return;

    setLastValue(input);
    const debouncedAPI = _.debounce(fetchData, 400, { maxWait: 1000 }); // debounce statement
    debouncedAPI();
  };

  const fetchData = async (search) => {
    search = search || lastValue;
    setLoading(1);
    const api_resp = await fetchPlacesApi(search);
    if (!api_resp || api_resp.status !== 200) return;

    handleData(filterApiResult(api_resp.data.results));
    setApiResults(api_resp.data.results);
    setLoading(null);
  };
  const filterApiResult = (results) => {
    // Parse results by removing zip code for places
    if (!results) return;

    return _.map(results, (result) => {
      const displayString = result.displayString.replace(/\d{5}-?\d*/g, "").trim();
      return { ...result, displayString };
    });
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
          <TextInput
            ref={inputRef_1}
            value={inputValue_1}
            onChangeText={handleTextChange}
            blurOnSubmit={false}
            placeholder={userLocation?.street || "Enter pickup location"}
            searchIcon={false}
            onFocus={() => setFocusedInput(0)}
            style={tw`${focusedInput === 0 ? "bg-gray-100" : "bg-gray-50"} text-xl ${inputValue_1 ? "text-gray-600" : "italic"} m-2 p-2`}
          />
          <TextInput
            ref={inputRef_2}
            value={inputValue_2}
            onChangeText={handleTextChange}
            searchIcon={false}
            onFocus={() => setFocusedInput(1)}
            blurOnSubmit={false}
            placeholder="Where to?"
            containerStyle={tw`bg-transparent border-0`}
            inputContainerStyle={tw`${focusedInput === 1 ? "bg-gray-100" : "bg-gray-50"} px-2`}
            style={tw`${focusedInput === 1 ? "bg-gray-100" : "bg-gray-50"} text-xl ${inputValue_2 ? "text-gray-600" : "italic"} p-2 m-2 mb-0`}
          />
        </View>
        <FAB icon={{ name: "add", color: "#000" }} size="small" color="#f3f3f3" visible={true} />
      </View>
      <LinearProgress style={[tw`bg-gray-200`, { marginVertical: 6 }]} variant={loading ? "indeterminate" : "determinate"} color="grey" />
    </View>
  );
});

export default SearchInput;
SearchInput.propTypes = {
  handleData: PropTypes.func.isRequired,
};
