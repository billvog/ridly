import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  title: string;
  isCapturing: boolean;
  onCaptureBackPressed: () => void;
};

export default function Header({
  title,
  isCapturing,
  onCaptureBackPressed,
}: HeaderProps) {
  const canGoBack = useMemo(() => {
    return isCapturing || router.canGoBack();
  }, [isCapturing, router.canGoBack()]);

  const goBack = useCallback(() => {
    if (isCapturing) {
      onCaptureBackPressed();
    } else {
      router.back();
    }
  }, [isCapturing]);

  return (
    <View className="absolute top-0 w-full">
      <SafeAreaView>
        <BlurView
          tint="dark"
          className="mx-4 my-2 px-6 py-4 rounded-xl overflow-hidden flex flex-row items-center"
        >
          {/* If we can go back, display back button */}
          {canGoBack && (
            <TouchableOpacity onPress={goBack} className="mr-4">
              <Entypo name="chevron-left" size={20} color="white" />
            </TouchableOpacity>
          )}
          <View>
            <Text className="font-extrabold text-xl text-white">{title}</Text>
            {isCapturing && (
              <Text className="font-medium text-white text-sm">
                Find the clue and tap it to capture!
              </Text>
            )}
          </View>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}
