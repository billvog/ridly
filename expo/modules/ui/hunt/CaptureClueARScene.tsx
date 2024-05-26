import { LocationPoint } from "@/types/general";
import { gpsToAR } from "@/utils/gpsToAR";
import { ViroARScene, ViroARSceneNavigator, ViroText } from "@viro-community/react-viro";
import {
  Viro3DPoint,
  ViroRotation,
} from "@viro-community/react-viro/dist/components/Types/ViroUtils";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";

type CaptureClueProps = {
  clueLocation: LocationPoint;
  onClueCaptured: () => void;
};

function CaptureClueARScene({ clueLocation, onClueCaptured }: CaptureClueProps) {
  const isReady = useRef(false);

  const [cluePosition, setCluePosition] = useState<Viro3DPoint>([0, 0, 0]);
  const [rotation, setRotation] = useState<ViroRotation>([0, 0, 0]);

  // Calculate distance between user and clue in meters
  // so we can render the clue on the AR scene.
  useEffect(() => {
    (async () => {
      // Fetch user's current location
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const clueLocationPoint = {
        latitude: clueLocation.lat,
        longitude: clueLocation.long,
      };

      const arCoordinates = gpsToAR(userLocation.coords, clueLocationPoint);
      setCluePosition([arCoordinates.x, 0, arCoordinates.z]);

      isReady.current = true;
    })();
  }, []);

  return (
    <ViroARScene
      onTrackingUpdated={(state) => {
        // console.log("Tracking state updated: ", state);
      }}
      onCameraTransformUpdate={(transform) => setRotation(transform.rotation)}
    >
      {isReady.current && (
        <ViroText
          text="Hello World"
          position={cluePosition}
          rotation={[0, -rotation[1], 0]}
          scale={[0.5, 0.5, 0.5]}
          style={styles.helloWorldTextStyle}
          onClick={onClueCaptured}
        />
      )}
    </ViroARScene>
  );
}

export default (props: CaptureClueProps) => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: () => CaptureClueARScene(props),
      }}
      style={{ flex: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 20,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});
