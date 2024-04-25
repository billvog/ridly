import { useSetNavigationOptions } from "@/hooks/useSetNavigationOptions";
import Button from "@/modules/ui/Button";
import { TextInput } from "@/modules/ui/TextInput";
import { APIResponse, api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const FormValidationSchema = z.object({
  first_name: z
    .string({ required_error: "First name is a required field" })
    .regex(/^[a-z]+$/i, "Last name can only contain characters"),

  last_name: z
    .string({ required_error: "Last name is a required field" })
    .regex(/^[a-z]+$/i, "Last name can only contain characters"),

  username: z
    .string({ required_error: "Username is a required field" })
    .regex(
      /^[a-z0-9](?!.*\.\.)[a-z0-9.]*[a-z0-9]$/i,
      "A username can only contain alphanumerical and periods. It can also not start, nor end, with a period."
    ),

  email: z
    .string({ required_error: "Email is a required field" })
    .email("Please enter a valid email"),

  password: z
    .string({ required_error: "Password is a required field" })
    .min(6, "Password must be at least 6 characters"),
});

type FormSchema = z.infer<typeof FormValidationSchema>;

export default function Page() {
  useSetNavigationOptions({ title: "Register" });

  const queryClient = useQueryClient();

  const formMethods = useForm<FormSchema>({
    resolver: zodResolver(FormValidationSchema),
  });

  const registerMutation = useMutation<APIResponse, any, FormSchema>({
    mutationFn: (values) => api("/user/register/", "POST", values),
  });

  const submitForm = formMethods.handleSubmit((data) => {
    registerMutation.mutate(data, {
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

        router.push({ pathname: "/" });
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
        <TextInput
          label="First name"
          name="first_name"
          placeholder="Enter your first name"
        />
        <TextInput
          label="Last name"
          name="last_name"
          placeholder="Enter your last name"
        />
        <TextInput
          label="Username"
          name="username"
          placeholder="Enter your username"
        />
        <TextInput label="Email" name="email" placeholder="Enter your email" />
        <TextInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          secureTextEntry
        />
      </FormProvider>
      <Button
        onPress={submitForm}
        disabled={registerMutation.isPending}
        buttonStyle="w-full"
      >
        Register
      </Button>
      <View className="mt-6">
        <Link href="/guest/login" className="text-center">
          Already have an account? <Text className="font-bold">Login</Text>
        </Link>
      </View>
    </View>
  );
}
