import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useLocation() {
  const [coords, setCoords] = useState(null);
  const [erroMsg, setErroMsg] = useState(null);

  useEffect(() => {
    // 1. Código de efeito (executado após a renderização)
    async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync(); //solicita a permissão para acessar a localização
        if (status !== "granted") {
          setErroMsg("Permissão negada para acessar a localização");
          return;
        }
        let location = Location.getCurrentPositionAsync({
          acurracy: Location.Accuracy.High,
        });
        setCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        setErroMsg("Erro ao obter a localização!");
      }
    };
  }, []);

  return { coords, erroMsg }; //retorno as coordenadas e a mensagem de erro
}
