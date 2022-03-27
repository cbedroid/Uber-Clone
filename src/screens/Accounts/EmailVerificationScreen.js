import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { APP_NAME } from "../../App";
import BackButton from "../../components/BackButton";
import { useFirebase } from "../../contexts/FirebaseContext";
import { selectUser } from "../../features/userSlice";

const EmailVerificationScreen = () => {
  const user = useSelector(selectUser);
  const { currentUser } = useFirebase();
  const { sendVerificationEmail } = useFirebase();
  // prevent user from spamming email verification
  const [totalMailSent, setTotalMailSent] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);

  const resendEmail = () => {
    if (!currentUser) return setErrorMessage("We encountered an error with your account. Please try again.");
    if (totalMailSent >= 3) return setErrorMessage("You have reached the maximum number of emails sent. Please try again later.");
    sendVerificationEmail(currentUser);
    setTotalMailSent(totalMailSent + 1);
  };

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <BackButton />
      <View style={tw` flex items-center`}>
        <Text style={tw`text-2xl text-gray-500 font-bold`}>Confirm Your Email</Text>
        <Icon type="feather" name="mail" size={68} style={tw`w-44 mx-auto my-4`} />
        <Text style={[styles.text]}>
          We sent a verification email to <Text style={tw`text-black font-bold`}>{user.email}</Text>
        </Text>

        <Text style={[styles.text, tw`text-sm text-gray-600 my-6`]}>
          Please check your email and follow the link to finish creating your <Text style={tw`text-black font-bold`}>{APP_NAME}</Text> Account.
        </Text>
        {!errorMessage ? (
          <View style={tw`flex flex-row items-center`}>
            <Text style={[styles.text, tw`text-base`]}>Didn&apos;t receive the email?</Text>
            <TouchableOpacity onPress={resendEmail}>
              <Text style={[styles.text, tw`underline text-base text-blue-600 font-bold ml-2`]}>Resend Email</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={tw`text-base text-red-600 my-4`}>{errorMessage}</Text>
        )}
      </View>
    </View>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "#333",
  },
});
