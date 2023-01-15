import React, { useCallback, useEffect, useRef, useState } from "react";

import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { SafeAreaView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FormBlock } from "components/ui/Form/FormBlock";
import FormGroup from "components/ui/Form/FormGroup";
import { Hero, HeroHeader } from "components/ui/Hero";
import Paragraph from "components/ui/Paragraph";
import {
  FORM_SUBMISSION_DEBOUNCE,
  FORMATTED_PHONE_NUMBER_MAX_LENGTH,
  REQUIRED_FIELD_MESSAGE,
} from "constants/errors";
import countryCodes from "country-codes-list";
import { lowerCase } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Icon } from "react-native-elements";
import { useDispatch } from "react-redux";
import tw from "twrnc";
import { CountryCodes } from "types";
import { toPhoneNumber } from "utils";

import LoadingDialog from "../../components/subcomponents/LoadingDialog";
import FormErrorField from "../../components/ui/Form/FormErrorField";
import { SMS_OPTOUT_NUMBER } from "../../constants/firebase";
import { resetUser, setUser } from "../../features/userSlice";
import { AccountStackParams } from "./types";

type FormData = {
  phoneNumber: string;
};

const countryCodesList: CountryCodes[] = countryCodes.all();
const defaultCountyCode = countryCodesList.find((code) => code.countryCode === "US");

const PhoneRegisterScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AccountStackParams>>();

  // @ts-ignore
  const inputRef = useRef<typeof TextInputProps | null>(null);
  // using loading to display form submitting ( hooks-form submission too fast)
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDropdownFocus, setDropdownFocus] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<CountryCodes | null>(
    defaultCountyCode || null,
  );

  useEffect(() => {
    // reset user redux state to prepare from new incoming data
    dispatch(resetUser());
  }, [dispatch]);

  const {
    control,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Watched phone number
  const formPhoneNumber = watch("phoneNumber");
  const canSubmitForm =
    !!countryCode &&
    formPhoneNumber.length === FORMATTED_PHONE_NUMBER_MAX_LENGTH &&
    !isSubmitting;

  const onSubmit = useCallback(
    ({ phoneNumber }: FormData) => {
      setLoading(true);
      // Converted phone number to real phone number format
      // e.g:  +1(555)-123-4567 --> 15551234567
      const realPhoneNumber =
        "+" + (countryCode?.countryCallingCode || 1) + toPhoneNumber(phoneNumber);

      dispatch(setUser({ phoneNumber: realPhoneNumber }));

      // Used to simulate form processing.
      setTimeout(() => {
        navigation.navigate("OTPVerificationScreen");
        setLoading(false);
      }, FORM_SUBMISSION_DEBOUNCE);
    },
    [countryCode?.countryCallingCode, dispatch, navigation],
  );

  // Convert raw phone number to human-readable format.
  const handleChangeText = useCallback((text: FormData["phoneNumber"]) => {
    const phoneNumber = text.replace(/\D/g, "");
    if (phoneNumber.length <= 5) return phoneNumber;
    switch (phoneNumber.length) {
      case 3:
        return `(${phoneNumber.slice(0, 3)})`;
      case 6:
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}`;
      case 10:
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
          3,
          6,
        )} - ${phoneNumber.slice(6, 10)}`;
      default:
        return text;
    }
  }, []);

  const dropDownItem = (item: CountryCodes) => {
    return (
      <View
        key={`country-code-${item.countryCode}`}
        style={tw`flex flex-row justify-between items-center border-b border-gray-100 p-2`}
      >
        <View style={tw`flex-1 flex flex-row justify-between items-center mr-2`}>
          <Text style={tw`text-4xl mr-4`}>{item?.flag}</Text>
          <Text>{item?.countryNameEn}</Text>
        </View>
        <Text>+{item?.countryCallingCode}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`bg-gray-50 flex-1`}>
      <View style={tw`mt-4`}>
        <Hero>
          <HeroHeader>Enter your mobile number</HeroHeader>
        </Hero>
        <FormBlock inline={true}>
          <FormGroup hasSelect={true} isFocus={isDropdownFocus}>
            <Dropdown
              style={[
                tw`flex item-top h-14`,
                styles.dropdown,
                isDropdownFocus && { borderColor: "#000" },
              ]}
              containerStyle={[
                tw`absolute top-0 left-0 w-10/12 shadow-xl p-1`,
                styles.container,
              ]}
              labelField="flag"
              valueField="flag"
              confirmSelectItem={true}
              data={countryCodesList}
              value={countryCode?.flag}
              placeholder=""
              renderRightIcon={() => (
                <Icon type="antdesign" name="caretdown" size={16} />
              )}
              renderItem={(item: CountryCodes, selected) => dropDownItem(item)}
              search={true}
              searchPlaceholder="Search by country code."
              searchQuery={(name, label) => {
                const flagList = countryCodesList.map((country) => {
                  if (lowerCase(country.countryCode).includes(name.toLowerCase())) {
                    return country.flag;
                  }
                  return "";
                });
                return !!flagList.includes(label);
              }}
              onFocus={() => setDropdownFocus(true)}
              onBlur={() => setDropdownFocus(false)}
              onChange={(item) => {
                setCountryCode(item);
                setDropdownFocus(false);
              }}
              showsVerticalScrollIndicator={true}
              keyboardAvoiding={true}
              autoScroll={true}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
            />
          </FormGroup>
          <FormGroup
            isText={true}
            isFocus={inputRef.current?.isFocused?.()}
            hasError={!!errors?.phoneNumber?.message}
          >
            <Text style={tw`text-xl text-gray-800`}>
              +{countryCode?.countryCallingCode}
            </Text>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: REQUIRED_FIELD_MESSAGE,
                },
                maxLength: {
                  value: FORMATTED_PHONE_NUMBER_MAX_LENGTH,
                  message: `Phone number can not exceed ${FORMATTED_PHONE_NUMBER_MAX_LENGTH} digits.`,
                },
                minLength: {
                  value: 10,
                  message: "Phone number must be at least 10 digits.",
                },
              }}
              render={({ field }) => (
                <TextInput
                  ref={inputRef}
                  style={tw`bg-gray-200 ml-2 pb-2 text-xl`}
                  keyboardType="number-pad"
                  maxLength={FORMATTED_PHONE_NUMBER_MAX_LENGTH}
                  placeholder="(202) 555-0123"
                  blurOnSubmit={false}
                  onChangeText={(text: FormData["phoneNumber"]) =>
                    field.onChange(handleChangeText(text))
                  }
                  value={field.value}
                  autoFocus={true}
                />
              )}
            />
          </FormGroup>
          <FormErrorField styles="p-4" error={errors?.phoneNumber?.message} />
        </FormBlock>
        <View style={tw`h-4/6 mt-3`}>
          <Paragraph>
            By proceeding, you consent to get calls, WhatsApp or SMS messages, including
            automated means, from Uber, and its affiliates to the number provided. Text
            &quot;STOP&quot; to {SMS_OPTOUT_NUMBER} to opt out.
          </Paragraph>
          <Button
            disabled={!canSubmitForm}
            onPress={handleSubmit(onSubmit)}
            containerStyle={tw`mt-auto flex justify-end items-end w-full pb-16`}
            buttonStyle={tw`bg-black rounded-full h-14 w-28 p-3`}
            icon={{ type: "fontisto", name: "arrow-right", color: "#fff", size: 24 }}
            title="Next"
            iconRight
          />
        </View>
      </View>
      <LoadingDialog isVisible={isLoading} />
    </SafeAreaView>
  );
};

export default PhoneRegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    display: "flex",
    maxHeight: 500,
  },
  dropdown: {
    width: 100,
    maxHeight: 20,
    zIndex: 1000,
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
