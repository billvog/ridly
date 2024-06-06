import { styled } from "nativewind";
import React from "react";
import {
  Text,
  View,
  type TextProps as RNTextProps,
  type ViewProps as RNViewProps,
} from "react-native";

type ErrorMessageProps = {
  children: string;
  viewStyle?: RNViewProps["style"];
  textStyle?: RNTextProps["style"];
};

function ErrorMessage({ children, viewStyle, textStyle }: ErrorMessageProps) {
  return (
    <View style={viewStyle}>
      <Text style={textStyle} className="font-bold text-base text-red-500">
        {children}
      </Text>
    </View>
  );
}

export default styled(ErrorMessage, {
  props: {
    viewStyle: true,
    textStyle: true,
  },
});
