import { useUser } from "@/hooks/user/useUser";
import AccountAvatar from "@/modules/ui/account/AccountAvatar";
import LogoutButton from "@/modules/ui/account/LogoutButton";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Href } from "expo-router/build/link/href";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Settings: OptionGroup[] = [
  {
    name: "General",
    options: [
      {
        name: "Account Information",
        href: "/(account)/accountInfo",
        icon: <Feather name="user" size={20} color="black" />,
      },
      {
        name: "Edit Profile",
        href: "/(account)/profile/edit",
        icon: <Feather name="edit-3" size={20} color="black" />,
      },
    ],
  },
];

export default function Page() {
  const user = useUser();

  if (!user) {
    return null;
  }

  return (
    <ScrollView>
      <View className="flex items-center py-14">
        <AccountAvatar user={user} />
        <View className="mt-8 flex items-center">
          <Text className="text-sm">Welcome back,</Text>
          <Text className="font-extrabold text-2xl">
            {[user.first_name, user.last_name].join(" ")}
          </Text>
        </View>
      </View>
      <PreferencesList options={Settings} />
    </ScrollView>
  );
}

type OptionGroup = {
  name: string;
  options: {
    name: string;
    href: Href;
    icon: React.ReactNode;
  }[];
};

function PreferencesList({ options }: { options: OptionGroup[] }) {
  const router = useRouter();
  return (
    <View>
      {options.map((group) => (
        <View key={group.name}>
          <Text className="px-4 py-4 text-xl font-extrabold">{group.name}</Text>
          <View className="divide-y-2 divide-gray-300 border-t-2 border-b-2 border-gray-300">
            {group.options.map((option) => (
              <TouchableOpacity
                key={option.name}
                className="flex flex-row items-center bg-gray-200 p-4"
                onPress={() => router.push(option.href)}
              >
                {option.icon}
                <Text className="ml-4 font-medium text-base">{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <LogoutButton />
    </View>
  );
}
