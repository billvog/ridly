import { Text, View } from "react-native";
import { useUser } from "@/hooks/user/useUser";
import { Image } from "expo-image";
import dayjs from "dayjs";

export default function Page() {
  const user = useUser();

  if (!user) {
    return null;
  }

  return (
    <View className="p-6" style={{ rowGap: 12 }}>
      <View className="py-8">
        <Image
          source={user.avatar_url}
          className="rounded-full mx-auto"
          style={{ width: 100, height: 100 }}
        />
      </View>

      <AccountInfoRow name="First Name" value={user.first_name} />
      <AccountInfoRow name="Last Name" value={user.last_name} />

      <AccountInfoSeperator />

      <AccountInfoRow name="Username" value={"@" + user.username} />
      <AccountInfoRow name="Email" value={user.email} />

      <AccountInfoSeperator />

      <AccountInfoRow name="Joined At" value={dayjs(user.created_at).format("LL")} />
    </View>
  );
}

type AccountInfoRowProps = {
  name: string;
  value: string;
};

function AccountInfoRow({ name, value }: AccountInfoRowProps) {
  return (
    <View>
      <Text>{name}</Text>
      <Text className="font-bold text-xl">{value}</Text>
    </View>
  );
}

function AccountInfoSeperator() {
  return <View style={{ paddingVertical: 5 }} />;
}
