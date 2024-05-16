import { THuntClue } from "@/types/hunt";
import { Text, TouchableOpacity, View } from "react-native";

type CurrentClueProps = {
  clue?: THuntClue;
  isNear: boolean;
  onCapturePressed: () => any;
};

export default function CurrentClue({
  clue,
  isNear,
  onCapturePressed,
}: CurrentClueProps) {
  return (
    <View className="bg-orange-100 h-[22%] p-6 space-y-4">
      {clue ? (
        <View>
          <Text className="text-sm text-orange-400 font-bold">Clue #{clue.order}</Text>
          <Text className="text-lg font-bold">{clue.riddle}</Text>
        </View>
      ) : (
        <View>
          <Text className="font-bold text-orange-400 text-base">
            Loading current clue...
          </Text>
        </View>
      )}

      {isNear ? (
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            className="mr-auto px-4 py-2 bg-black rounded-xl"
            onPress={onCapturePressed}
          >
            <Text className="font-extrabold text-base text-orange-50">Capture Clue!</Text>
          </TouchableOpacity>
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
