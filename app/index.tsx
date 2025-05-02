import { View, Text } from "react-native";
import React, { useEffect } from "react";
import ButtonComponent from "@/components/common/ButtonComponent";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  // Sử dụng useEffect để chuyển hướng sau 5 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/SplashScreen");
    }, 1000); // 5000ms = 5 giây

    // Dọn dẹp bộ đếm thời gian khi component bị unmount
    return () => clearTimeout(timer);
  }, [router]); // Phụ thuộc vào router để đảm bảo tính ổn định

  return <View style={{ flex: 1 }}></View>;
};

export default Index;
