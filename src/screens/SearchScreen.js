import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import StackBottomSheet from "../components/StackBottomSheet";
import SearchInput from "../components/subcomponents/SearchInput";
import { selectNearbyPlaces, selectUserLocation } from "../features/locationSlice";
import { selectOrigin, setOrigin } from "../features/navSlice";
import { fetchPlacesApi, textEllipsis } from "../Helper";

// eslint-disable-next-line react/display-name
const SearchScreen = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const nearbyPlaces = useSelector(selectNearbyPlaces);
  const userLocation = useSelector(selectUserLocation);
  const origin = useSelector(selectOrigin);
  const searchInputRef = React.createRef(0);
  const [data, setData] = useState([]);
  // flag to determined if data was refreshed or not.
  // (true --> data=`placeAPI search data` | false --> data=`nearby cities data`)
  const [isRefreshed, setRefresh] = useState(false);

  useEffect(() => {
    console.log("SearchScreen loaded");
    setData(nearbyPlaces);
    setUserInitialOrigin();
  }, []);

  const updateData = (new_data) => {
    setData(new_data);
    setRefresh(true);
  };

  const setUserInitialOrigin = async () => {
    if (!userLocation || origin) return;
    //                          street                        city                          state
    const userFullAddress = `${userLocation?.street} , ${userLocation?.adminArea5}, ${userLocation?.adminArea3}`;
    const api_response = await fetchPlacesApi(userFullAddress);
    if (!api_response || api_response.status !== 200) return;
    dispatch(setOrigin(api_response.data.results[0]));
  };

  /**
   * Preps and converts location data into store geo format.
   * See feature/NavSlice `toGeoFormat` method.
   *
   *  @params {object} item - nearby city location data.
   *
   **/
  const convertToGeoFormat = (item) => {
    const fullAddress = item?.fields ? `${item?.fields.address}, ${item?.fields.city}, ${item?.fields.state}` : item?.displayString;
    return {
      name: item?.fields?.address,
      lat: parseFloat(item?.fields?.lat),
      lng: parseFloat(item?.fields?.lng),
      displayString: fullAddress,
    };
  };

  /**
   * handles nearby city ListItem  press events
   * @param {object} item - nearby city object
   */
  const handlePress = (item) => {
    const formattedCity = isRefreshed ? item : convertToGeoFormat(item);

    // Calls the `useImperativeHandle` method on searchInput
    // This method is called from SearchInput Child component.
    // It's needed to determine the correct `focused input`, which is needed
    // to determine which dispatch method to call (setOrigin or setDestination).
    searchInputRef.current.setOriginDestination(formattedCity, !isRefreshed);
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
      <SearchInput ref={searchInputRef} handleData={updateData} />
      <ScrollView>{data?.map((item, index) => renderItem(item, index))}</ScrollView>
    </StackBottomSheet>
  );
};

export default SearchScreen;
