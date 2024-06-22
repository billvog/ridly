import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import EventScrollFeed from "@/modules/ui/event/scroll-feed";
import { useGetUserProfile } from "@/types/gen";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

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

  useEffect(() => {
    navigation.setOptions({
      title: user?.username ?? "User Profile",
      headerBackTitleVisible: false,
    } satisfies NativeStackNavigationOptions);
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
        <View className="mb-4">
          <Image
            source={{ uri: user.avatar_url ?? "https://placehold.co/20/000/FFF" }}
            className="w-24 h-24 rounded-full"
          />
        </View>
        <View>
          <Text className="font-bold text-xl">
            {user.first_name + " " + user.last_name}
          </Text>
          {user.profile.bio && (
            <Text className="mt-1 text-xs text-gray-600">{user.profile.bio}</Text>
          )}
        </View>
      </View>
      <View>
        <EventScrollFeed title="Joined" events={joinedEvents} cardHeight={300} />
      </View>
    </ScrollView>
  );
}