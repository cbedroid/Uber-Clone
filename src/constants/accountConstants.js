import EmailPasswordScreen from "../screens/Accounts/EmailPasswordScreen";
import EmailVerificationScreen from "../screens/Accounts/EmailVerificationScreen";
import NameRegisterScreen from "../screens/Accounts/NameRegisterScreen";
import OTPVerificationScreen from "../screens/Accounts/OTPVerificationScreen";
import PhoneRegisterScreen from "../screens/Accounts/PhoneRegisterScreen";
import SignInScreen from "../screens/Accounts/SignInScreen";

export const ACCOUNT_SCREENS = [
  {
    name: "PhoneRegisterScreen",
    component: PhoneRegisterScreen,
  },
  {
    name: "OTPVerificationScreen",
    component: OTPVerificationScreen,
  },
  {
    name: "NameRegisterScreen",
    component: NameRegisterScreen,
  },
  {
    name: "EmailPasswordScreen",
    component: EmailPasswordScreen,
  },
  {
    name: "EmailVerificationScreen",
    component: EmailVerificationScreen,
  },

  {
    name: "SignInScreen",
    component: SignInScreen,
  },
];
