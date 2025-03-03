import React, { useState } from "react";
import SplashScreen from "./Splash";
import InputComponent from "../components/InputComponent";
import { Image, SafeAreaView, View } from "react-native";
import ButtonComponent from "../components/ButtonComponent";
import OnBoarding from "./OnBoarding";
import { appInfo } from "../constants/appInfo";
import VerifyCode from "./auth/OtpVerification";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import ResetSuccessfully from "./auth/ResetSuccessfully";
import OtpVerification from "./auth/OtpVerification";
import Profile from "./user/Profile";

const HomeScreen = () => {
  return <OnBoarding />;
};

export default HomeScreen;
