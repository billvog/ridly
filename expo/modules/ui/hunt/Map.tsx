import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";

type MapProps = {
  mapRef: React.RefObject<MapView>;
  userLocation: LatLng | null;
  children: React.ReactNode[];
};

export default function Map({ mapRef, userLocation, children }: MapProps) {
  const hasSetInitialRegion = useRef(false);

  // Once userLocation is set, animate to that location, but only for the first time
  useEffect(() => {
    if (!userLocation || !mapRef.current || hasSetInitialRegion.current) {
      return;
    }

    mapRef.current.animateToRegion({
      ...userLocation,
      latitudeDelta: 0.0092,
      longitudeDelta: 0.0092,
    });

    hasSetInitialRegion.current = true;
  }, [userLocation, mapRef]);

  return (
    <MapView
      ref={mapRef}
      className="flex-1 h-auto"
      mapType="hybrid"
      provider={PROVIDER_GOOGLE}
    >
      {/* Draw marker on user's location */}
      {userLocation && (
        <Marker coordinate={userLocation} zIndex={20}>
          <View className="w-4 h-4 rounded-full bg-orange-400" />
        </Marker>
      )}

      {children}
    </MapView>
  );
}
