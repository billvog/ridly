import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import EventScrollFeed from "@/modules/ui/event/scroll-feed";
import FollowButton from "@/modules/ui/user-profile/FollowButton";
import { useGetUserProfile } from "@/types/gen";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

export const ProfileShowNavigationOptions: NativeStackNavigationOptions = {
  title: "Profile",
  headerBackTitleVisible: false,
};

export default function ProfileShow() {
  const { id: userId } = useLocalSearchParams();
  const navigation = useNavigation();

  const userProfileQuery = useGetUserProfile(typeof userId === "string" ? userId : "", {
    query: { enabled: typeof userId === "string" },
  });

  const [refreshUserProfile, isUserProfileRefreshing] = useIsRefreshing(
    userProfileQuery.refetch
  );

  const user = useMemo(() => userProfileQuery.data?.user, [userProfileQuery]);
  const joinedEvents = useMemo(
    () => userProfileQuery.data?.joined_events ?? [],
    [userProfileQuery]
  );

  // Set the title of the screen to the user's username
  useEffect(() => {
    if (user) {
      navigation.setOptions({
        title: user.username,
      });
    }
  }, [navigation, user]);

  if (userProfileQuery.isLoading) {
    return <FullscreenSpinner />;
  }

  if (!userId || !user) {
    return <FullscreenError>Couldn't find user.</FullscreenError>;
  }

  return (
    <ScrollView
      className="divide-y-2 divide-gray-300"
      refreshControl={
        <RefreshControl
          refreshing={isUserProfileRefreshing}
          onRefresh={refreshUserProfile}
        />
      }
    >
      <View className="p-8 pb-6">
        <View className="mb-4 flex-row align-middle">
          <Image
            source={{ uri: user.avatar_url ?? "https://placehold.co/20/000/FFF" }}
            className="w-24 h-24 rounded-full mr-8"
          />

          <View className="flex-1 flex-row justify-evenly">
            <ProfileCounter label="Followers" count={user.profile.follower_count ?? 0} />
            <ProfileCounter label="Following" count={user.profile.following_count ?? 0} />
          </View>
        </View>

        <View className="mb-4">
          <Text className="font-bold text-xl">
            {user.first_name + " " + user.last_name}
          </Text>
          {user.profile.bio && (
            <Text className="mt-1 text-xs text-gray-600">{user.profile.bio}</Text>
          )}
        </View>

        <View>
          <FollowButton user={user} />
        </View>
      </View>
      <View>
        <EventScrollFeed
          title="Joined"
          events={joinedEvents}
          cardHeight={300}
          noEventsMessage="No joined events."
        />
      </View>
    </ScrollView>
  );
}

function ProfileCounter({ count, label }: { count: number; label: string }) {
  return (
    <View className="justify-center">
      <Text className="text-center font-medium text-3xl">{count}</Text>
      <Text className="text-center text-xs">{label}</Text>
    </View>
  );
}
