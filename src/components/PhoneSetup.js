import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Icon } from "react-native-elements";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { setUser } from "../features/userSlice";
const countryCodes = require("country-codes-list");

const PhoneSetup = () => {
  const inputRef = useRef();
  const prevValue = useRef();
  const [isFocus, setIsFocus] = useState(false);
  const [textFocus, setTextFocus] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  const [value, setValue] = useState(null);
  const [codes, setCodes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("PhoneSetup loaded");
  }, []);

  useEffect(() => {
    setErrorMessage("");
    setCodes(countryCodes.all());
    const initialValue = codes.filter((code) => code.countryCode === "US") || [];
    setCountryCode(initialValue[0]);
  }, [codes]);

  const validateNumber = () => {
    // TODO: Add phone number validation in production mode

    const phoneNumber = (value || "").replace(/[^\d/]/, "");
    if (phoneNumber.length < 10) return "Invalid phone number";
  };
  const handleSubmit = () => {
    const error = validateNumber();
    if (!error) {
      const fullNumber = (countryCode?.countryCallingCode || 1) + value;
      dispatch(setUser({ phoneNumber: fullNumber }));
    }
    setErrorMessage(error);
  };

  const dropDownItem = (item, index) => {
    return (
      <View key={index} style={tw`flex flex-row content-between items-center p-4`}>
        <View style={tw`flex-1 flex flex-row content-between items-center `}>
          <Text style={tw`text-4xl mr-4`}>{item?.flag}</Text>
          <Text>{item?.countryNameEn}</Text>
        </View>
        <Text>+{item?.countryCallingCode}</Text>
      </View>
    );
  };

  const handleChangeText = (input) => {
    let text;
    // handle back spacing
    if ((prevValue?.current || "").length > input.length) {
      setValue(input);
      prevValue.current = input;
      return;
    }

    // strips the input and remove all non-digits
    const rawInput = input;
    input = input.replace(/[^\d]/g, "");
    console.log("\nLooped");
    switch (input.length) {
      case 3:
        text = `(${input.slice(0, 3)})`;
        break;
      case 6:
        console.log("case 6", input);
        text = `(${input.slice(0, 3)}) ${input.slice(3, 6)}`;
        break;
      case 10:
        text = `(${input.slice(0, 3)}) ${input.slice(3, 6)} - ${input.slice(6, 10)}`;
        break;
      default:
        text = rawInput || input;
        break;
    }
    prevValue.current = text;
    setValue(text);
    setErrorMessage("");
  };

  return (
    <SafeAreaView style={tw`bg-gray-50 flex-1`}>
      <Text style={tw`text-xl text-gray-800 mb-4`}>Enter your mobile number</Text>
      <View style={tw`flex flex-row items-center h-14 `}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "#000" }]}
          containerStyle={[tw`absolute -top-8 -left-0 w-11/12 shadow-xl p-1`, styles.container]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={codes}
          maxHeight={500}
          labelField="flag"
          valueField="flag"
          placeholder=""
          value={countryCode?.flag}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setCountryCode(item);
            setIsFocus(false);
          }}
          renderRightIcon={() => <Icon type="antdesign" name="caretdown" size={16} />}
          renderItem={(item, index) => dropDownItem(item, index)}
        />
        <View style={tw`flex flex-row items-center content-between bg-gray-200 px-2 h-14 w-56 ${textFocus && "border-2"}`}>
          <Text style={tw`text-xl text-gray-800`}>+{countryCode?.countryCallingCode}</Text>
          <TextInput
            value={value}
            ref={inputRef}
            style={tw`ml-2 text-lg`}
            keyboardType="numeric"
            placeholder="(202) 555-0123"
            onFocus={() => setTextFocus(true)}
            onBlur={() => setTextFocus(false)}
            blurOnSubmit={false}
            searchIcon={false}
            maxLength={18} //setting limit of input
            onChangeText={(input) => handleChangeText(input)}
            onSubmitEditing={handleSubmit}
          />
        </View>
      </View>
      <Text style={tw`text-red-600 py-2`}>{errorMessage}</Text>
      <View style={tw`h-5/6`}>
        <Text style={[tw`text-sm text-gray-500`]}>
          By proceeding, you consent to get calls, WhatsApp or SMS messages, including automated means, from Uber, and its affiliates to the number provided.
        </Text>
        <Button
          onPress={handleSubmit}
          containerStyle={tw`mt-auto flex justify-end items-end w-full pb-16`}
          buttonStyle={tw`bg-black rounded-full h-14 w-28 p-3`}
          icon={{ type: "fontisto", name: "arrow-right", color: "#fff", size: 24 }}
          title="Next"
          color="#000"
          iconRight
        />
      </View>
    </SafeAreaView>
  );
};

export default PhoneSetup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    overflow: "scroll",
  },
  dropdown: {
    height: "100%",
    width: 120,
    zIndex: 1000,
    borderColor: "transparent",
    backgroundColor: "#f6f6f6",
    borderWidth: 2,
    marginRight: 6,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    flex: 1,
    margin: "auto",
    fontSize: 36,
    textAlign: "center",
    padding: 0,
    marginTop: 5,
    height: 60,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
});