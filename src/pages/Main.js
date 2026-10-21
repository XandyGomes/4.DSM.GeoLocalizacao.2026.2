import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useLocation from '../hooks/useLocation';

export default function Main() { 
  const { coords, errorMsg } = useLocation(); // Hook personalizado para obter a localização

  if (errorMsg) { // Se houver uma mensagem de erro, exibe-a
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!coords) { // Se as coordenadas não estiverem disponíveis, exibe um indicador de carregamento
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: coords.latitude, // Define a latitude inicial
        longitude: coords.longitude, // Define a longitude inicial
        latitudeDelta: 0.02, // Define a variação de latitude
        longitudeDelta: 0.02, // Define a variação de longitude
      }}
      showsUserLocation={true} // Permite mostrar a localização do usuário no mapa
    >
      <Marker // Adiciona um marcador no mapa
        coordinate={coords} // Define as coordenadas do marcador
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
