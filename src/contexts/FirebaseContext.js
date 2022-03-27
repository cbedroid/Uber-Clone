/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
// eslint-disable-next-line import/no-unresolved
import { FIREBASE_AUTHDOMAIN } from "@env";
import { reauthenticateWithCredential, signInWithEmailAndPassword, sendEmailVerification, PhoneAuthProvider, updateProfile, signOut } from "firebase/auth";
import { setUser } from "../features/userSlice";
import app, { auth } from "../firebase";
import { getObjectDiff } from "../Helper";
import store from "../store/index";

const FirebaseContext = React.createContext();

export function useFirebase() {
  return useContext(FirebaseContext);
}

/**
 *  Custom Firebase Context Provider
 * @returns Context Provider
 */
export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let prevState;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log("AuthState Changed");

      if (user) {
        prevState = prevState || user;
        console.log("user Email", user.emailVerified);

        _handleAuthChanges(user, prevState);
      } else {
        // User is signed out
        // ...
      }
    });

    return unsubscribe;
  }, []);

  const _getActionCodeSettings = () => {
    return {
      // url: "https://www.example.com/?email=" + currentUser.email,
      url: `https://${FIREBASE_AUTHDOMAIN}/?email=${currentUser.email}`,
      iOS: {
        bundleId: "com.uberclone",
      },
      android: {
        packageName: "com.uberclone",
        installApp: true,
        minimumVersion: "12",
      },
      handleCodeInApp: true,
      // When multiple custom dynamic link domains are defined, specify which
      // one to use.

      dynamicLinkDomain: `https://${FIREBASE_AUTHDOMAIN}/`,
    };
  };

  /**
   * Observes firebase current user changes and map them to redux
   *
   * @param {*} userState  - current user state
   * @param {*} prevState  - previous user state
   */
  const _handleAuthChanges = (userState, prevState) => {
    const userChanges = getObjectDiff(userState, prevState);

    for (const key in userChanges) {
      switch (key) {
        case key === "emailVerified":
          store.dispatch(setUser({ emailVerified: userState.emailVerified }));
          console.log(`AuthStateChanged  ${prevState.emailVerified} => ${userState.emailVerified}`);
          break;

        default:
          console.log("UnCaught AuthStateChanged", key);
      }
    }
  };

  const signIn = (user, password, onSuccess, onError) => {
    signInWithEmailAndPassword(auth, user, password)
      .then((credential) => {
        console.log("User Signed In Successfully");
        store.dispatch(setUser({ isLoggedIn: true }));
        if (typeof onSuccess === "function") return onSuccess(credential);
      })
      .catch((error) => {
        console.log("User Signed In Failed", error);
        //TODO: Handle error message base on invalid email or wrong password
        if (typeof onError === "function") return onError(error.code);
      });
  };
  const signInWithCredential = (credential, onSuccess, onError) => {
    auth
      .signInWithCredential(credential)
      .then(() => {
        console.log("User Signed In With Credential Successfully");
        store.dispatch(setUser({ isLoggedIn: true }));
        return onSuccess();
      })
      .catch((error) => {
        console.log("User Signed In With Credential Failed", error);
        return onError(error.code);
      });
  };
  const reauthenticateUser = (email, password) => {
    // NOTE: User must be currently logged to reauthenticate
    // Great for updating user sensitive data like email,password ...etc
    if (!currentUser) return;
    reauthenticateWithCredential(currentUser, { email, password })
      .then(() => {
        console.log("Reauthenticate user successfully");
      })
      .catch((error) => {
        console.log("ReauthenticateError", error);
      });
  };

  /**
   *  send 6 digits firebase phone verication code to user
   *
   */
  const sendPhoneVerificationCode = async (phoneNumber, recaptchaState, onSuccess, onError) => {
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.
    console.log("\nSending Phone Verification Code");
    const phoneProvider = new PhoneAuthProvider(auth);
    phoneProvider
      .verifyPhoneNumber(phoneNumber, recaptchaState)
      .then((verificationId) => {
        console.log("PhoneVerification code sent successfully to", phoneNumber);
        if (typeof onSuccess === "function") return onSuccess(verificationId);
      })
      .catch((error) => {
        console.log("\nPhoneVerificationError:", error);
        if (typeof onError === "function") return onError(error.code);
      });
  };

  /**
   * sendVerificationEmail
   *
   * @param {object} currentUser - firebase auth current user
   * @param {function} onSuccess - callback function to execute on success verification notice sent
   * @returns
   */
  const sendVerificationEmail = async (onSuccess) => {
    if (!currentUser) return;

    console.log("\nSending Verification Email");
    sendEmailVerification(currentUser)
      .then(() => {
        console.log("Verification Email was sent successfully");

        if (typeof onSuccess === "function") onSuccess();
      })
      .catch((error) => {
        console.log("Firebase VerificationEmail Error", error);
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }
      });
  };

  /**
   * Update the user's profile
   *
   * @param {object} currentUser - firebase auth current user
   * @param {object} updateData - user updated parameters
   * @returns
   */
  const updateUserProfile = (updateData) => {
    if (!currentUser) return;
    console.log("\nUpdating User Profile");
    updateProfile(currentUser, updateData)
      .then(() => {
        console.log("\nUser Profile Updated successfully\n");
      })
      .catch((error) => {
        console.log("\nUser Profile Update Error", error);
      });
  };

  /**
   *
   * Sign Out Current User
   */
  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully");
        store.dispatch(setUser({ isLoggedIn: false }));
      })
      .catch((error) => {
        console.log("Oops... something went wrong while logging Out", error);
      });
  };

  /* values for provider */
  const value = {
    currentUser,
    signIn,
    signInWithCredential,
    reauthenticateUser,
    sendPhoneVerificationCode,
    sendVerificationEmail,
    updateUserProfile,
    logout,
  };

  // Provider
  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}
