import Button from "@/modules/ui/Button";
import { TextInput } from "@/modules/ui/TextInput";
import { UserMeQueryResponse, useUserCompleteSignup, userMeQueryKey } from "@/types/gen";
import { setFormErrors } from "@/utils/formErrors";
import { handleMutationError } from "@/utils/mutationError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const ZodValidationSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(2, "Must be longer that 2 characters")
    .max(50, "Must be less than 50 characters"),
});

type FormSchema = z.infer<typeof ZodValidationSchema>;

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const completeSignupMutation = useUserCompleteSignup();

  const formMethods = useForm<FormSchema>({
    resolver: zodResolver(ZodValidationSchema),
  });

  const submitForm = formMethods.handleSubmit((data) => {
    completeSignupMutation.mutate(data, {
      onSuccess: (data) => {
        // Update query cache with the new user data
        queryClient.setQueryData<UserMeQueryResponse>(userMeQueryKey(), (previous) =>
          previous ? { ...previous, ...data } : undefined
        );

        // Show success toast
        Toast.show({
          type: "success",
          text1: "Whoah!",
          text2: "You have successfully completed your account setup!",
        });

        // Go back or, if we can't, go to home
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/");
        }
      },
      onError: (error: any) =>
        handleMutationError(error, (error) =>
          setFormErrors(error.errors, formMethods.setError)
        ),
    });
  });

  return (
    <View className="p-6">
      <Text>
        There are a few more steps to complete your account setup. Don't worry, it's going
        to be quick!
      </Text>

      <View className="mt-8">
        <FormProvider {...formMethods}>
          <TextInput
            label="Username"
            name="username"
            placeholder="Pick a username, must be unique"
          />
        </FormProvider>
        <Button onPress={submitForm} loading={completeSignupMutation.isPending}>
          Done
        </Button>
      </View>
    </View>
  );
}
