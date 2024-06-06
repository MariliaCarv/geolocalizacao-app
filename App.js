import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_OSM, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState([]);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBzLSMnCRY250XYaIM5uxS7QJeeYQXiRvk';

  // Definir origin e destination fora do useEffect
  const [origin, setOrigin] = useState(null);
  const destination = { latitude: -23.5505, longitude: -46.6333 }; // São Paulo, por exemplo

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização não concedida');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setOrigin(location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      } : null);

      // Simulando dados de marcadores
      const mockData = [
        { id: 1, latitude: 37.78825, longitude: -122.4324, title: 'Marcador 1' },
        { id: 2, latitude: 37.78925, longitude: -122.4334, title: 'Marcador 2' },
      ];
      setData(mockData);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={{ flex: 1 }}>
      {location && (
        <MapView
          style={{ flex: 1 }}
          provider={PROVIDER_OSM}
          initialRegion={{
            latitude: origin ? origin.latitude : -15.8267,
            longitude: origin ? origin.longitude : -47.9218,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {origin && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor="hotpink"
            />
          )}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Marker"
            description="This is a marker on OSM"
          />
          {data.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
            />
          ))}
        </MapView>
      )}
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
