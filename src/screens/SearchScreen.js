import React, { useState, useEffect, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import PlaceSearchInputs from "../components/PlaceSearchInputs";
import StackBottomSheet from "../components/StackBottomSheet";
import { selectNearbyPlaces } from "../features/locationSlice";
import { selectPlaces } from "../features/navSlice";
import { textEllipsis, randomizeArray } from "../Helper";
import { convertToGeoFormat } from "../Utils";

// eslint-disable-next-line react/display-name
const SearchScreen = ({ navigation: { goBack } }) => {
  const nearbyPlaces = useSelector(selectNearbyPlaces);
  const placeData = useSelector(selectPlaces);
  const placeSearchRef = React.createRef(0);
  const [data, setData] = useState([]);
  // flag to determined if list data was refreshed or not.
  // (true --> data=`placeAPI search data` | false --> data=`nearby cities data`)
  const [isRefreshed, setRefresh] = useState(false);

  useEffect(() => {
    console.log("SearchScreen loaded");
    setData(nearbyPlaces);
  }, []);

  const updateData = useMemo(() => {
    setData(placeData);
    setRefresh(true);
  }, [placeData]);

  /**
   * handles nearby city ListItem  press event
   * @param {object} item - nearby city object
   */
  const handlePress = (item) => {
    if (!item) return;
    let formattedCity;
    try {
      formattedCity = convertToGeoFormat(item);
    } catch {
      formattedCity = item;
    }
    placeSearchRef.current.setOriginDestination(formattedCity, !isRefreshed);
  };

  /**
   *  Renders the layout for initial nearby cities.
   *  initial data -->  data = `nearby cites close to user current location`
   *  onDataUpdate -->  data = `return places search from Place API `
   *
   * @params {object} item - nearby city or saved places
   * @params {index} item  - current index of item's data.
   * @returns {element} - component element
   */
  const renderItem = (item, index) => {
    const fullAddress = item?.fields ? `${item?.fields.address}, ${item?.fields.city}, ${item?.fields.state}` : item?.displayString;

    return (
      <TouchableOpacity key={index} onPress={() => handlePress(item)} style={tw`flex flex-row items-center border-b border-gray-200 p-3`}>
        <Icon type="material" name="location-pin" size={24} color="white" containerStyle={tw`bg-gray-400 w-10 h-10 rounded-full mx-4`} style={tw`m-auto`} />
        <View style={tw`flex-1`}>
          <Text style={[tw`text-lg`, { fontFamily: "UberTextRegular" }]}>{item?.name}</Text>
          <Text style={tw`text-gray-400`}>{textEllipsis(fullAddress)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <StackBottomSheet>
      <View style={tw`flex flex-row items-center justify-between p-2`}>
        <View style={tw` items-start`}>
          <TouchableOpacity onPress={() => goBack()}>
            <Icon type="ionicons" name="arrow-back" size={32} />
          </TouchableOpacity>
        </View>
        <View style={tw`flex flex-row items-center mx-auto`}>
          <Icon type="font-awesome-5" name="user-circle" size={28} color="#d3d3d3" />
          <Text style={tw`mx-2`}>For Me</Text>
          <Icon type="font-awesome" name="angle-down" />
        </View>
      </View>
      <PlaceSearchInputs ref={placeSearchRef} handleData={updateData} />
      <ScrollView>{randomizeArray(data)?.map((item, index) => renderItem(item, index))}</ScrollView>
    </StackBottomSheet>
  );
};

export default SearchScreen;
