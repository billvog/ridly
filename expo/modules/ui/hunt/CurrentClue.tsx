import { THuntClue } from "@/types/hunt";
import { Text, View } from "react-native";
import Button from "@/modules/ui/Button";

type CurrentClueProps = {
  clue?: THuntClue;
  isClueLoading: boolean;
  isNear: boolean;
  onCapturePressed: () => any;
  isCaptureClueLoading: boolean;
};

export default function CurrentClue({
  clue,
  isClueLoading,
  isNear,
  onCapturePressed,
  isCaptureClueLoading,
}: CurrentClueProps) {
  return (
    <View className="bg-orange-100 h-[22%] p-6 space-y-4">
      <View>
        {isClueLoading ? (
          <Text className="font-bold text-orange-400 text-base">
            Loading current clue...
          </Text>
        ) : clue ? (
          <>
            <Text className="text-sm text-orange-400 font-bold">Clue #{clue.order}</Text>
            <Text className="text-lg font-bold">{clue.riddle}</Text>
          </>
        ) : (
          <Text className="font-bold text-red-500 text-base">
            Something went wrong fetching the clue. Please try again.
          </Text>
        )}
      </View>

      {isNear ? (
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
          <Text className="font-medium text-base">
            Get near the clue to be able to capture it!
          </Text>
        </View>
      )}
    </View>
  );
}
