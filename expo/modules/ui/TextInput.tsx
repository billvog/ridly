import React from "react";
import { UseControllerProps, useController, useFormContext } from "react-hook-form";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
  View,
} from "react-native";

type TextInputProps<TComponent extends React.ElementType = typeof RNTextInput> =
  RNTextInputProps &
    UseControllerProps & {
      label: string;
      name: string;
      defaultValue?: string;
      component?: TComponent;
    };

function ControlledInput<T extends React.ElementType>(props: TextInputProps<T>) {
  const { formState } = useFormContext();
  const {
    name,
    label,
    rules,
    defaultValue,
    component: Component = RNTextInput,
    ...inputProps
  } = props;
  const { field } = useController({ name, rules, defaultValue });
  const hasError = Boolean(formState?.errors[name]);

  return (
    <View className="mb-4 space-y-2.5">
      {label && <Text className="font-bold">{label}</Text>}
      <Component
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
}

export const TextInput = <T extends React.ElementType = typeof RNTextInput>(
  props: TextInputProps<T>
) => {
  return <ControlledInput {...props} />;
};
