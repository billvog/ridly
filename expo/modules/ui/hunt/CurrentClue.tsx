import { THuntClue } from "@/types/hunt";
import { BlurView } from "expo-blur";
import { Text, TouchableOpacity } from "react-native";

type CurrentClueProps = {
  clue: THuntClue;
  hasReached: boolean;
  onCapturePressed: () => any;
};

export default function CurrentClue({
  clue,
  hasReached,
  onCapturePressed,
}: CurrentClueProps) {
  return (
    <BlurView tint="dark" intensity={40} className="w-full px-10 pt-4 pb-10">
      <Text className="text-center text-white text-base font-extrabold">
        {clue.riddle}
      </Text>
      {hasReached && (
        <TouchableOpacity
          activeOpacity={0.5}
          className="mx-auto mt-2 px-4 py-2 bg-black rounded-xl"
          onPress={onCapturePressed}
        >
          <Text className="text-white font-bold text-xs">Tap to Capture Clue</Text>
        </TouchableOpacity>
      )}
    </BlurView>
  );
}
