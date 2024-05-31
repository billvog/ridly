import React, { useEffect, useState } from "react";
import { LatLng, Circle } from "react-native-maps";

function accurateToInaccurateCoordinates(coordinates: LatLng): LatLng {
  function random() {
    return Math.random() * 0.00025;
  }

  return {
    latitude: coordinates.latitude + random(),
    longitude: coordinates.longitude + random(),
  };
}

type InaccurateCircleProps = {
  center: LatLng;
  radius: number;
};

/*
  This component takes a (accurate) coordinate set, and draws a Map circle
  centered inaccurately. We need that for displaying the area in which the clue
  is located when we reach its location by a threshold set by the clue.
*/
export default function InaccurateCircle({ center, radius }: InaccurateCircleProps) {
  const [inaccurateCenter, setInaccurateCenter] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    setInaccurateCenter(accurateToInaccurateCoordinates(center));
  }, []);

  return (
    <Circle
      center={inaccurateCenter}
      radius={radius}
      strokeWidth={2}
      strokeColor="rgba(255, 0, 0, 0.8)"
      fillColor="rgba(255, 0, 0, 0.35)"
    />
  );
}
