import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Callout, Marker } from "react-native-maps";
import { CapturedHuntClue } from "@/types/hunt";
import { Text, View } from "react-native";

type ClueMapMarkerProps = {
  clue: CapturedHuntClue;
};

export default function ClueMapMarker({ clue }: ClueMapMarkerProps) {
  return (
    <Marker
      zIndex={10}
      coordinate={{
        latitude: clue.location_point.lat,
        longitude: clue.location_point.long,
      }}
      title={`Clue #${clue.order}`}
      description={clue.riddle}
    >
      <Entypo name="location-pin" size={40} color="red" />
      <ClueMapCallout clue={clue} />
    </Marker>
  );
}

type ClueMapCalloutProps = {
  clue: CapturedHuntClue;
};

function ClueMapCallout({ clue }: ClueMapCalloutProps) {
  return (
    <Callout tooltip>
      <View
        className="relative bg-orange-100 rounded-xl px-6 py-4"
        style={{ width: 240 }}
      >
        <Text className="font-bold text-xs text-orange-400">Clue #{clue.order}</Text>
        <Text className="font-extrabold text-sm">{clue.riddle}</Text>
      </View>
      <View className="w-4 h-4 bg-orange-100 border-orange-100 border-b-8 border-l-8 -rotate-45 rounded mx-auto -mt-2.5 mb-2" />
    </Callout>
  );
}
