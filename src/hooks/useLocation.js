import * as Location from 'expo-location'; // Importa o módulo de localização do Expo
import { useEffect, useState } from 'react';  // Importa o hook useEffect e useState do React 

export default function useLocation() { // Hook personalizado para obter a localização
  const [coords, setCoords] = useState(null); // Estado para armazenar as coordenadas
  const [errorMsg, setErrorMsg] = useState(null);  // Estado para armazenar a mensagem de erro

  useEffect(() => { // Efeito colateral para obter a localização
    (async () => { // Função auto-invocada para obter a localização
     try {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Solicita permissão para acessar a localização
      if (status !== 'granted') { // Verifica se a permissão foi concedida
        setErrorMsg('Permissão negada para acessar a localização'); // Define a mensagem de erro
        return; // Se a permissão não for concedida, retorna e não tenta obter a localização
      }

      let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High, 	
      }); // Obtém a localização atual
      setCoords({
        latitude: location.coords.latitude, // Define as coordenadas de latitude
        longitude: location.coords.longitude, // Define as coordenadas de longitude
      }); // Atualiza o estado com as coordenadas obtidas

      } catch (error) {
        setErrorMsg("Erro ao obter a localização");
      }

    })(); // Função auto-invocada para obter a localização
  }, []); // O array vazio [] significa que o efeito só será executado uma vez, semelhante ao componentDidMount

  return { coords, errorMsg }; // Retorna as coordenadas e a mensagem de erro
}
