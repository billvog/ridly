import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";

type MapProps = {
  mapRef: React.RefObject<MapView>;
  userLocation: LatLng;
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
        ...userLocation,
        latitudeDelta: 0.0092,
        longitudeDelta: 0.0092,
      }}
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
