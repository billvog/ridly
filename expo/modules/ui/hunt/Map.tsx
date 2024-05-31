import React from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { LocationPoint } from "@/types/general";

type MapProps = {
  mapRef: React.RefObject<MapView>;
  userLocation: LocationPoint;
  children: React.ReactNode[];
};

export default function Map({ mapRef, userLocation, children }: MapProps) {
  return (
    <MapView
      ref={mapRef}
      className="flex-1 h-auto"
      mapType="hybrid"
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: userLocation.lat,
        longitude: userLocation.long,
        latitudeDelta: 0.0092,
        longitudeDelta: 0.0092,
      }}
    >
      {/* Draw marker on user's location */}
      {userLocation && (
        <Marker
          coordinate={{
            latitude: userLocation.lat,
            longitude: userLocation.long,
          }}
          zIndex={20}
        >
          <View className="w-4 h-4 rounded-full bg-orange-400 border-2 border-white" />
        </Marker>
      )}

      {children}
    </MapView>
  );
}
