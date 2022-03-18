import React, { useState, useRef } from "react";
import { View, TextInput } from "react-native";
import { PropTypes } from "prop-types";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { setPlaces } from "../../features/navSlice";
import { textEllipsis } from "../../Helper";
import { fetchPlacesApi } from "../../Utils";
import AnimatedIcon from "./AnimatedIcon";
const _ = require("lodash");

// eslint-disable-next-line react/display-name
const SearchInput = React.forwardRef((props, ref) => {
  const [value, setValue] = useState(null);

  const dispatch = useDispatch(null);
  const prevValue = useRef(null);
  const focusRef = useRef(0);

  const handleTextChange = (input) => {
    setValue(input);

    input = input.toLowerCase();
    if (input.trim().length < 6) return;
    props?.handleLoading && props.handleLoading();

    // Prevents recalling fetchPlaces when user is either backspacing
    // or results are already available from previous search
    if (prevValue && prevValue.current?.toLowerCase().startsWith(input)) return;

    prevValue.current = input;
    const debouncedAPI = _.debounce(fetchPlaces, 400, { maxWait: 1000 }); // debounce statement
    debouncedAPI(input);
  };

  const filterPlaceData = (results) => {
    // Parse results by removing zip code for places
    if (!results) return;

    return _.map(results, (result) => {
      const displayString = result.displayString.replace(/\d{5}-?\d*/g, "").trim();
      return { ...result, displayString };
    });
  };

  /**
   *
   * @param {String} address
   * @returns
   */
  const fetchPlaces = async (address) => {
    address = address || prevValue;
    const api_resp = await fetchPlacesApi(address);
    if (!api_resp || api_resp.status !== 200) return;

    const filterData = filterPlaceData(api_resp.data.results);
    dispatch(setPlaces(filterData));
  };

  React.useImperativeHandle(ref, () => ({
    setSelectedValue(val) {
      setValue(val);
    },
    isFocused() {
      return focusRef.current;
    },
  }));

  return (
    <View style={tw`flex flex-row items-center content-between ${focusRef?.current ? "bg-gray-100" : "bg-gray-50"}  p-2 m-2 mb-0 `}>
      <TextInput
        ref={ref}
        defaultValue={textEllipsis(value)}
        onChangeText={handleTextChange}
        blurOnSubmit={false}
        placeholder={props.placeholder || "Enter location"}
        searchIcon={false}
        inputContainerStyle={tw` px-2`}
        onFocus={() => {
          focusRef.current = true;
        }}
        onBlur={() => (focusRef.current = false)}
        style={tw`flex-1 ${focusRef?.current ? "bg-gray-100" : "bg-gray-50"} text-xl ${value ? "text-gray-600" : "italic"} mr-3`}
        {...props}
      />
      <AnimatedIcon isHidden={!value} handleClearInput={() => setValue(null)} type="font-awesome" name="close" size={16} color="#c3c3c3" />
    </View>
  );
});

export default SearchInput;
SearchInput.propTypes = {
  handleLoading: PropTypes.func,
};
