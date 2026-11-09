import React, { useState } from "react";
import Main from "./src/pages/Main";
import Cadastro from "./src/pages/Cadastro";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function App() {
  // Controla qual tela está visível: "mapa" (localização atual) ou "cadastro" (endereço -> coordenadas)
  const [tela, setTela] = useState("mapa");

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {tela === "mapa" ? <Main /> : <Cadastro />}

        {/* Barra simples para alternar entre as duas telas */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.botao} onPress={() => setTela("mapa")}>
            <Text style={[styles.texto, tela === "mapa" && styles.ativo]}>Minha localização</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => setTela("cadastro")}>
            <Text style={[styles.texto, tela === "cadastro" && styles.ativo]}>Cadastro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  botao: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  texto: {
    color: "#888",
    fontSize: 16,
  },
  ativo: {
    color: "#3498db",
    fontWeight: "bold",
  },
});
