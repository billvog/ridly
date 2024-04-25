import { useSetNavigationOptions } from "@/hooks/useSetNavigationOptions";
import { TextInput } from "@/modules/ui/TextInput";
import { APIResponse, api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const FormValidationSchema = z.object({
  email: z.string({ required_error: "Email is a required field" }),
  password: z.string({ required_error: "Password is a required field" }),
});

type FormSchema = z.infer<typeof FormValidationSchema>;

export default function Page() {
  useSetNavigationOptions({ title: "Login" });

  const queryClient = useQueryClient();

  const formMethods = useForm<FormSchema>({
    resolver: zodResolver(FormValidationSchema),
  });

  const loginMutation = useMutation<APIResponse, any, FormSchema>({
    mutationFn: (values) => api("/user/login/", "POST", values),
  });

  const submitForm = formMethods.handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: async (data) => {
        if (!data.ok) {
          if (data.status === 400) {
            Toast.show({ type: "error", text1: data.data.detail });
          } else {
            Toast.show({ type: "error", text1: "Something went wrong." });
          }

          return;
        }

        Toast.show({
          type: "success",
          text1: "Logged in as",
          text2: data.data.user?.username,
          text1Style: {
            fontSize: 14,
            fontWeight: "normal",
          },
          text2Style: {
            fontSize: 16,
            color: "black",
            fontWeight: "bold",
          },
        });

        // Update cache
        queryClient.setQueryData(["user", "me"], data);

        router.push("/");
      },
      onError: (error) => {
        console.log(error);
        Toast.show({ type: "error", text1: "Something went wrong." });
      },
    });
  });

  return (
    <View className="p-6">
      <FormProvider {...formMethods}>
        <TextInput label="Email" name="email" placeholder="Enter your email" />
        <TextInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          secureTextEntry
        />
      </FormProvider>
      <Pressable
        onPress={submitForm}
        disabled={loginMutation.isPending}
        className="mx-auto bg-black px-6 py-3 rounded-xl disabled:opacity-60"
      >
        <Text className="text-white font-bold">Login</Text>
      </Pressable>
    </View>
  );
}
