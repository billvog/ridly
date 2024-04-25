import React from "react";
import {
  UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface TextInputProps extends RNTextInputProps, UseControllerProps {
  label: string;
  name: string;
  defaultValue?: string;
}

const ControlledInput = (props: TextInputProps) => {
  const { formState } = useFormContext();
  const { name, label, rules, defaultValue, ...inputProps } = props;
  const { field } = useController({ name, rules, defaultValue });
  const hasError = Boolean(formState?.errors[name]);

  return (
    <View className="mb-6 space-y-2.5">
      {label && <Text className="font-bold">{label}</Text>}
      <RNTextInput
        autoCapitalize="none"
        textAlign="left"
        className="px-5 py-3 bg-gray-200 rounded-xl"
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        {...inputProps}
      />
      {hasError && (
        <View>
          <Text className="text-red-500 font-bold">
            {formState.errors[name]?.message as string}
          </Text>
        </View>
      )}
    </View>
  );
};

export const TextInput = (props: TextInputProps) => {
  return <ControlledInput {...props} />;
};
