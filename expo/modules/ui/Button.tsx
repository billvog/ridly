import classNames from "classnames";
import { styled } from "nativewind";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type TextProps as RNTextProps,
} from "react-native";

type ButtonProps = {
  onPress: () => any;
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: RNTextProps["style"];
  textStyle?: RNTextProps["style"];
  children: React.ReactNode | string;
};

function Button({
  onPress,
  disabled = false,
  loading = false,
  buttonStyle,
  textStyle,
  children,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyle}
      className={classNames(
        "relative flex justify-center items-center bg-black px-6 py-3 rounded-xl active:opacity-80",
        {
          "opacity-80": disabled || loading,
        }
      )}
    >
      {loading && (
        <View className="absolute">
          <ActivityIndicator size={18} />
        </View>
      )}
      <View className={classNames({ "opacity-0": loading })}>
        {typeof children === "string" ? (
          <Text className="text-center text-white font-bold" style={textStyle}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}

export default styled(Button, {
  props: {
    buttonStyle: true,
    textStyle: true,
  },
});
