import Button from "@/modules/ui/Button";
import { THuntClue } from "@/types/hunt";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";

type CurrentClueProps = {
  clue?: THuntClue;
  isClueLoading: boolean;
  onRetryFetchCluePressed: () => any;
  isNear: boolean;
  onCapturePressed: () => any;
  isCaptureClueLoading: boolean;
};

function CurrentClueContainer({
  children,
  isRefreshing = false,
  onRefresh,
}: {
  children: React.ReactNode;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}) {
  return (
    <View className="h-[30%]">
      <ScrollView
        className="h-full bg-orange-100"
        refreshControl={
          onRefresh && <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      >
        <View className="space-y-4">{children}</View>
      </ScrollView>
    </View>
  );
}

export default function CurrentClue({
  clue,
  isClueLoading,
  onRetryFetchCluePressed,
  isNear,
  onCapturePressed,
  isCaptureClueLoading,
}: CurrentClueProps) {
  // If clue is loading, show loading indicator
  if (isClueLoading) {
    return (
      <CurrentClueContainer>
        <View className="flex-1 items-center mt-10">
          <ActivityIndicator size="small" />
          <Text className="font-bold text-sm mt-4">Loading clue...</Text>
        </View>
      </CurrentClueContainer>
    );
  }

  return (
    <CurrentClueContainer
      isRefreshing={isClueLoading}
      onRefresh={onRetryFetchCluePressed}
    >
      <View>
        {clue ? (
          <>
            <Text className="text-sm text-orange-400 font-bold">Clue #{clue.order}</Text>
            <Text className="text-lg font-extrabold">{clue.riddle}</Text>
          </>
        ) : (
          <Text className="font-bold text-red-500 text-base">
            Something went wrong fetching the clue.
            {`\n`}
            Please try again.
          </Text>
        )}
      </View>

      {!clue ? (
        <Button onPress={onRetryFetchCluePressed} buttonStyle="mr-auto mt-4">
          Retry
        </Button>
      ) : isNear ? (
        <View>
          <Button
            onPress={onCapturePressed}
            loading={isCaptureClueLoading}
            buttonStyle="mr-auto"
            textStyle="font-extrabold"
          >
            Capture Clue!
          </Button>
        </View>
      ) : (
        <View>
          <Text className="font-bold text-base">Next:</Text>
          <Text className="font-medium text-sm">
            Get near the clue to be able to capture it!
          </Text>
        </View>
      )}
    </CurrentClueContainer>
  );
}
