import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MAPQUEST_APIKEY } from "@env";
import axios from "axios";
import PropTypes from "prop-types";
import { Input } from "react-native-elements";
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
  const [, updateState] = useState();
  const inputRef = React.createRef();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    console.log("AutoComplete loaded");
  }, []);

  // Hides dropdown menu if any part of the
  // parent container is touched
  React.useImperativeHandle(ref, () => ({
    hideDropDown() {
      setHidden(true);
    },
  }));

  const handleInput = async (input) => {
    setHidden(false);
    input = input.toLowerCase().trim();
    setSelectedItem(false);

    if (input.length < 6) return;

    // Prevents recalling fetchApi when user is either backspacing
    // or results are already available for current search
    if (value && value.toLowerCase().startsWith(input)) return;

    setValue(input);
    const debouncedAPI = _.debounce(fetchAPI, 400, { maxWait: 1000 }); // debounce statement
    debouncedAPI();
  };

  const parseResults = (results) => {
    // Parse results by removing zip code for places
    if (!results) return;

    return _.map(results, (result) => {
      const displayString = result.displayString
        .replace(/\d{5}-?\d*/g, "")
        .trim();
      return { ...result, displayString };
    });
  };

  const fetchAPI = async () => {
    if (!value) return;

    setResults(null);
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
      setErrorMsg("Place not found");
      console.error("Error", error);
    }
  };

  const submitData = (data) => {
    props.handleSubmit(data);
    setSelectedItem(props.locationProp);
    setPlaceholder(data.displayString);
    setResults(null);
    forceUpdate();
  };

  return (
    <View>
      <Input
        ref={inputRef}
        onChangeText={handleInput}
        placeholder={placeholder || props.placeholder || "Enter a location."}
        shake={true}
        errorMessage={errorMsg}
        leftIcon={{
          type: "font-awesome",
          name: `${!selectedItem ? "search" : "check"}`,
          size: 12,
          color: `${!selectedItem ? "#ccc" : "#009117"}`,
        }}
      />
      {!isHidden && (
        <FlatList
          ref={ref}
          style={[
            styles.FlatList,
            tw`${!value ? "hidden border-0" : "flex"} ${
              (inputRef?.current?.isFocused() || results) &&
              "border border-gray-200 rounded-sm shadow-md"
            }`,
          ]}
          data={results}
          keyExtractor={(item) => item.id}
          refreshing={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => submitData(item)}
              style={tw`p-2 w-full`}
            >
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
    position: "absolute",
    top: 50,
    left: 0,
    zIndex: 100,
    width: "100%",
    maxHeight: 250,
    height: "auto",
    backgroundColor: "#fff",
  },
});

// locationProp -> origin or destination
MapQuestAutoComplete.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  locationProp: PropTypes.any,
};
