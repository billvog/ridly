import { useUser } from "@/hooks/user/useUser";
import Button from "@/modules/ui/Button";
import { TextInput } from "@/modules/ui/TextInput";
import {
  GetUserProfileQuery,
  UserMeQuery,
  getUserProfileQueryKey,
  useUpdateUserProfile,
  userMeQueryKey,
} from "@/types/gen";
import { setFormErrors } from "@/utils/formErrors";
import { handleMutationError } from "@/utils/mutationError";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

export const ProfileEditNavigationOptions: NativeStackNavigationOptions = {
  title: "Edit Profile",
  headerBackTitleVisible: false,
};

const ZodValidationSchema = z.object({
  bio: z.string().min(0).max(500, "Must be less than 500 characters"),
});

type FormSchema = z.infer<typeof ZodValidationSchema>;

export default function ProfileEdit() {
  const queryClient = useQueryClient();
  const user = useUser();

  const updateUserProfileMutation = useUpdateUserProfile();

  //
  const formMethods = useForm<FormSchema>({
    resolver: zodResolver(ZodValidationSchema),
    defaultValues: {
      bio: user?.profile.bio ?? "",
    },
  });

  //
  const dismissKeyboard = useCallback(() => Keyboard.dismiss(), []);

  //
  const submitForm = formMethods.handleSubmit((data) => {
    dismissKeyboard();

    updateUserProfileMutation.mutate(data, {
      onSuccess(data) {
        // Update the user profile from cache
        queryClient.setQueryData<GetUserProfileQuery["Response"]>(
          getUserProfileQueryKey(user!.id),
          (old) =>
            old
              ? {
                  ...old,
                  user: {
                    ...old.user,
                    profile: {
                      ...old.user.profile,
                      ...data,
                    },
                  },
                }
              : undefined
        );

        // Update the user/me query from cache
        queryClient.setQueryData<UserMeQuery["Response"]>(userMeQueryKey(), (old) =>
          old ? { ...old, profile: { ...old.profile, ...data } } : undefined
        );

        // Show success toast
        Toast.show({
          type: "success",
          text1: "Profile updated!",
        });
      },
      onError(error) {
        handleMutationError(error as any, (error) =>
          setFormErrors(error.errors, formMethods.setError)
        );
      },
    });
  });

  if (!user) {
    return null;
  }

  return (
    <View className="flex-1">
      <View className="flex-1 p-8">
        <FormProvider {...formMethods}>
          <TextInput
            label="Bio"
            name="bio"
            placeholder="Write a short bio about yourself"
            multiline={true}
          />
        </FormProvider>
      </View>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={80}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
          <View className="p-6">
            <Button
              onPress={submitForm}
              loading={updateUserProfileMutation.isPending}
              buttonStyle="mx-auto"
              textStyle="text-base"
            >
              Update
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
