import React from "react";
import { View } from "react-native";

type FullscreenMessage = {
  children: string | React.ReactNode;
};

export default function FullscreenMessage({ children }: FullscreenMessage) {
  return (
    <View className="w-full h-full flex-1 flex justify-center items-center">
      {children}
    </View>
  );
}
