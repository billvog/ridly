import classNames from "classnames";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, type TextProps as RNTextProps } from "react-native";

type ButtonProps = {
  onPress: () => any;
  disabled?: boolean;
  buttonStyle: RNTextProps["style"];
  children: React.ReactNode | string;
};

function Button({
  onPress,
  disabled = false,
  buttonStyle,
  children,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={buttonStyle}
      className={classNames(
        "bg-black px-6 py-3 rounded-xl disabled:opacity-60"
      )}
    >
      {typeof children === "string" ? (
        <Text className="text-center text-white font-bold">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export default styled(Button, {
  props: {
    buttonStyle: true,
  },
});
