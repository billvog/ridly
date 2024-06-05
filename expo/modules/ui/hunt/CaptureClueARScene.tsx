import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { LocationPoint } from "@/types/general";
import { gpsToAR } from "@/utils/gpsToAR";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroNode,
  ViroSphere,
  ViroText,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

type CaptureClueProps = {
  clueLocation: LocationPoint;
  onClueCaptured: () => void;
};

type CaptureClueARSceneProps = CaptureClueProps & {
  onReady: (ready: boolean) => void;
};

function CaptureClueARScene({
  clueLocation,
  onClueCaptured,
  onReady,
}: CaptureClueARSceneProps) {
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

      onReady(true);
    })();
  }, []);

  useEffect(() => {
    console.log(
      "Tracking state:",
      trackingState === ViroTrackingStateConstants.TRACKING_NORMAL
        ? "Tracking normal"
        : "Not tracking"
    );

    // If tracking state is normal, we can render our scene.
    onReady(trackingState === ViroTrackingStateConstants.TRACKING_NORMAL);
  }, [trackingState]);

  return (
    <ViroARScene onTrackingUpdated={setTrackingState}>
      <ViroNode position={cluePosition}>
        <ViroText
          text="Tap to CAPTURE!"
          transformBehaviors={["billboard"]}
          position={[0, 0.4, 0]}
          scale={[0.3, 0.3, 0.3]}
          style={styles.captureClueTextStyle}
          onClick={() => onClueCaptured()}
        />
        <ViroSphere scale={[0.2, 0.2, 0.2]} />
      </ViroNode>
    </ViroARScene>
  );
}

export default (props: CaptureClueProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () =>
            CaptureClueARScene({ ...props, onReady: (ready) => setIsReady(ready) }),
        }}
        style={{ flex: 1 }}
      />

      {/* Render loading spinner if we're not ready. */}
      {!isReady && (
        <View
          className="absolute w-full h-full"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <FullscreenSpinner />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  captureClueTextStyle: {
    fontFamily: "Arial",
    fontWeight: "900",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});
