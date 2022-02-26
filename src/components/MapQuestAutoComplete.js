import React, { useState, useEffect } from "react"
import PropTypes from "prop-types";
import axios from "axios";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Input } from "react-native-elements"
import tw from "tailwind-react-native-classnames"
// eslint-disable-next-line import/no-unresolved
import { MAPQUEST_APIKEY } from "@env"
const _ = require("lodash");

// eslint-disable-next-line react/display-name
const MapQuestAutoComplete = React.forwardRef((props, ref) => {

  const mapQuestURL = "https://web.mapquestapi.com/search/v3/prediction"
  const [value, setValue] = useState(null)
  const [isFound, setFound] = useState(0)
  const [results, setResults] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [isHidden, setHidden] = useState(false)
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);


  useEffect(() => {
    console.log("AutoComplete Mounted")
  })


  // Hides dropdown menu if any part of the 
  // parent container is touched
  React.useImperativeHandle(
    ref,
    () => ({
      hideDropDown() {
        console.log("hiding DropDown")
        setHidden(true)
      }
    }),
  )

  const handleInput = async (input) => {
    setHidden(false)
    input = input.toLowerCase()
    setFound(false)

    if (input.length < 6) return

    // Prevents recalling fetchApi when user is either backspacing 
    // or results are already available for current search 
    if (value && value.toLowerCase().startsWith(input)) return

    setValue(input)
    const debouncedAPI = _.debounce(fetchAPI, 400, { maxWait: 1000 }); // debounce statement
    debouncedAPI()
  }


  const parseResults = (results) => {
    // Parse results by removing zip code for places
    if (!results) return

    return _.map(results, (result) => {
      const displayString = result.displayString.replace(/\d{5}\-?\d*/g, "").trim()
      return { ...result, displayString }
    })
  }

  const fetchAPI = async () => {
    if (!value) return

    setResults(null)
    setErrorMsg("")
    console.log("Fetching API")
    try {
      const api_resp = await axios({
        baseURL: mapQuestURL,
        method: "GET",
        params: {
          collection: "address,adminArea,airport,category,franchise,poi",
          feedback: true,
          key: MAPQUEST_APIKEY,
          limit: 15,
          q: value
        },
        responseType: "json"
      })
      setResults(parseResults(api_resp.data.results))
    } catch (error) {
      setErrorMsg("Place not found")
      console.error("Error", error)
    }
    forceUpdate()
  }



  const submitData = (data) => {
    props.handleSubmit(data)
    setFound(props.refState)
    setResults(null)
  }

  return (
    <View>
      <Input
        onChangeText={handleInput}
        placeholder={props.refState ? props.refState.description : props.placeholder || "Where To?"}
        shake={true}
        errorMessage={errorMsg}
        leftIcon={{ type: "font-awesome", name: `${!isFound ? "search" : "check"}`, size: 12, color: `${!isFound ? "#ccc" : "#009117"}` }}
      />
      {!isHidden && (
        <FlatList
          ref={ref}
          style={[styles.FlatList, tw`${!value ? "hidden" : "flex border border-gray-200 shadow-md rounded-sm"}`]}
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => submitData(item)}
              style={tw`p-2 w-full`}>
              <Text style={tw`p-1  font-semibold`}>{item.displayString}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
})

export default MapQuestAutoComplete

const styles = StyleSheet.create({
  Input: {
    position: "relative"
  },

  FlatListContainer: {
    position: "relative"
  },
  FlatList: {
    position: "absolute",
    top: 80,
    left: 0,
    zIndex: 100,
    width: "100%",
    maxHeight: 250,
    height: "auto",
    backgroundColor: "#fff"
  }

})

MapQuestAutoComplete.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  refState: PropTypes.any.isRequired,
}