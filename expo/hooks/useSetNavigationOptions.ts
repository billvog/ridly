import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export const useSetNavigationOptions = (
  options: NativeStackNavigationOptions
) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions(options);
  }, [navigation]);
};
