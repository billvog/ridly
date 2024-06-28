import React from "react";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { useRouter, useSegments } from "expo-router";

type AccountAvatarProps = {
  user: {
    id: string;
    avatar_url: string;
  };
};

export default function AccountAvatar({ user }: AccountAvatarProps) {
  const router = useRouter();
  const segments = useSegments();

  const onAvatarPress = React.useCallback(() => {
    router.push({
      pathname: `/(tabs)/${segments[1]}/profile/[id]/show`,
      params: { id: user.id },
    });
  }, [user.id, router]);

  return (
    <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.7}>
      <Image
        source={user.avatar_url}
        className="rounded-full"
        style={{ width: 100, height: 100 }}
      />
    </TouchableOpacity>
  );
}
