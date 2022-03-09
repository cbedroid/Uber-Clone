import React, { useState, useEffect } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { MAPQUEST_APIKEY } from "@env";
import axios from "axios";
import PropTypes from "prop-types";
import { SearchBar } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
// eslint-disable-next-line import/no-unresolved
const _ = require("lodash");

// eslint-disable-next-line react/display-name
const MapQuestAutoComplete = React.forwardRef((props, ref) => {
  const mapQuestURL = "https://web.mapquestapi.com/search/v3/prediction";
  const [value, setValue] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [placeholder, setPlaceholder] = useState("");
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isHidden, setHidden] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [, updateState] = useState();
  const inputRef = React.createRef();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    console.log("AutoComplete loaded");

    const previous_search = props.locationProp?.description;
    if (!previous_search) return;
    setPlaceholder(previous_search);
  }, [props.locationProp]);

  // Hides dropdown menu if any part of the
  // parent container is touched
  React.useImperativeHandle(ref, () => ({
    hideDropDown() {
      setHidden(true);
    },
  }));

  const textEllipsis = (text) => {
    // Custom text ellipsis style for text input

    const window_width = Dimensions.get("screen").width - 120;
    text = text.trim();
    const CHAR_SIZE = 8; // font size
    const maxCharacters = (window_width / CHAR_SIZE).toFixed(0);
    const text_length = text.length * CHAR_SIZE;
    return text_length > window_width ? text.slice(0, maxCharacters) + " ..." : text;
  };

  const handleInput = async (input) => {
    setHidden(false);
    setValue(input);
    input = input.toLowerCase().trim();
    setSelectedItem(false);

    if (input.length < 6) return;

    // Prevents recalling fetchApi when user is either backspacing
    // or results are already available from previous search
    if (value && value.toLowerCase().startsWith(input)) return;

    const debouncedAPI = _.debounce(fetchAPI, 400, { maxWait: 1000 }); // debounce statement
    debouncedAPI();
  };

  const parseResults = (results) => {
    // Parse results by removing zip code for places
    if (!results) return;

    return _.map(results, (result) => {
      const displayString = result.displayString.replace(/\d{5}-?\d*/g, "").trim();
      return { ...result, displayString };
    });
  };

  const fetchAPI = async () => {
    if (!value) return;

    setErrorMsg("");
    try {
      const api_resp = await axios({
        baseURL: mapQuestURL,
        method: "GET",
        params: {
          collection: "address,adminArea,airport,category,franchise,poi",
          feedback: true,
          key: MAPQUEST_APIKEY,
          limit: 15,
          q: value,
        },
        responseType: "json",
      });
      setResults(parseResults(api_resp.data.results));
    } catch (error) {
      setErrorMsg("Sorry, we could not find this place!");
      console.error("Error", error);
    }
  };

  const submitData = (data) => {
    props.handleSubmit(data);
    setSelectedItem(props.locationProp);
    setPlaceholder(data.displayString);
    setValue(null);
    setResults(null);
    forceUpdate();
  };

  return (
    <View style={tw`bg-gray-200 rounded-md mx-4 z-50`}>
      <SearchBar
        ref={inputRef}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => !results && setFocus(false)}
        inputContainerStyle={tw`bg-gray-200`}
        inputStyle={tw`text-gray-600 ${value?.length === 0 ? "italic" : "font-semibold"}`}
        containerStyle={tw`bg-gray-200 border-0 rounded-lg p-0`}
        renderErrorMessage={false}
        onChangeText={handleInput}
        onClear={() => {
          setFocus(false), setValue(null);
        }}
        placeholder={textEllipsis(placeholder || props.placeholder || "Enter a location.")}
        placeholderTextColor="#bbb"
        searchIcon={{
          type: "font-awesome",
          name: `${!selectedItem ? "search" : "check"}`,
          size: 16,
          color: `${!selectedItem ? "#ccc" : "#009117"}`,
          backgroundColor: "transparent",
          containerStyle: tw`flex flex-row items-center bg-gray-200 h-full`,
        }}
        cancelIcon={{
          type: "font-awesome",
          name: "user",
          size: 16,
          color: `${!selectedItem ? "#ccc" : "#009117"}`,
          backgroundColor: "transparent",
          containerStyle: tw`flex flex-row items-center bg-gray-200 h-full`,
        }}
      />

      {!isHidden && (
        <FlatList
          ref={ref}
          style={[
            styles.FlatList,
            tw`z-50 ${!results || !isFocus ? "hidden border-0" : "flex"} ${
              results && "border border-gray-200 rounded-sm shadow-md"
            }`,
          ]}
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => submitData(item)} style={tw`p-2 w-full`}>
              <Text style={tw`p-1  font-semibold`}>{item.displayString}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
});

export default MapQuestAutoComplete;

const styles = StyleSheet.create({
  Input: {
    position: "relative",
  },
  FlatList: {
    width: "100%",
    maxHeight: 350,
    height: "auto",
    backgroundColor: "#fff",
  },
});

// locationProp -> origin or destination
MapQuestAutoComplete.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  locationProp: PropTypes.any,
};
