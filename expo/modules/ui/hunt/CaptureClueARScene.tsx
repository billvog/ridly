import { LocationPoint } from "@/types/general";
import { gpsToAR } from "@/utils/gpsToAR";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroNode,
  ViroSphere,
  ViroText,
  ViroTrackingStateConstants,
} from "@viro-community/react-viro";
import { Viro3DPoint } from "@viro-community/react-viro/dist/components/Types/ViroUtils";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";

type CaptureClueProps = {
  clueLocation: LocationPoint;
  onClueCaptured: () => void;
};

function CaptureClueARScene({ clueLocation, onClueCaptured }: CaptureClueProps) {
  const isReady = useRef(false);

  const [trackingState, setTrackingState] = useState<ViroTrackingStateConstants>();
  const [cluePosition, setCluePosition] = useState<Viro3DPoint>([0, 0, 0]);

  // Calculate distance between user and clue in meters
  // so we can render the clue on the AR scene.
  useEffect(() => {
    (async () => {
      // Fetch user's current location
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
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

  useEffect(() => {
    console.log(
      "Tracking state:",
      trackingState === ViroTrackingStateConstants.TRACKING_NORMAL
        ? "Tracking normal"
        : "Not tracking"
    );
  }, [trackingState]);

  return (
    <ViroARScene onTrackingUpdated={setTrackingState}>
      {isReady.current && (
        <ViroNode position={cluePosition}>
          <ViroText
            text="Tap to CAPTURE!"
            transformBehaviors={["billboard"]}
            position={[0, 0.4, 0]}
            scale={[0.3, 0.3, 0.3]}
            style={styles.helloWorldTextStyle}
            onClick={() => onClueCaptured()}
          />
          <ViroSphere scale={[0.2, 0.2, 0.2]} />
        </ViroNode>
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
    fontWeight: "900",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});
