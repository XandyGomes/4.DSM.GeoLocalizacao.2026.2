import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // Módulo do Expo que também faz a conversão endereço -> coordenadas

// Região inicial do mapa (centro do Brasil), usada enquanto não há nenhum cadastro
const REGIAO_INICIAL = {
  latitude: -14.235,
  longitude: -51.9253,
  latitudeDelta: 30,
  longitudeDelta: 30,
};

export default function Cadastro() {
  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Lista de usuários cadastrados (guardada apenas no estado, de forma temporária)
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Região exibida no mapa (muda para o último endereço cadastrado)
  const [regiao, setRegiao] = useState(REGIAO_INICIAL);

  const limparCampos = () => {
    setNome('');
    setRua('');
    setNumero('');
    setCidade('');
    setEstado('');
  };

  const cadastrar = async () => {
    // Validação simples: todos os campos são obrigatórios
    if (!nome || !rua || !numero || !cidade || !estado) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setCarregando(true);
    try {
      // No Android é preciso pedir a permissão de localização antes de geocodificar
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permita o acesso à localização para continuar.');
        return;
      }

      // Monta o endereço completo em uma única string
      const enderecoCompleto = `${rua}, ${numero}, ${cidade}, ${estado}, Brasil`;

      // Converte o endereço em coordenadas. Retorna um array (normalmente com 1 item)
      const resultado = await Location.geocodeAsync(enderecoCompleto);

      // Se o array vier vazio, o endereço não foi encontrado
      if (resultado.length === 0) {
        Alert.alert('Endereço não encontrado', 'Confira os dados e tente novamente.');
        return;
      }

      const { latitude, longitude } = resultado[0]; // Pega a primeira posição retornada

      const novoUsuario = {
        id: Date.now().toString(),
        nome,
        enderecoCompleto,
        latitude,
        longitude,
      };

      setUsuarios((anteriores) => [...anteriores, novoUsuario]); // Adiciona sem perder os anteriores
      setRegiao({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }); // Centraliza o mapa no novo endereço
      limparCampos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização do endereço.');
    } finally {
      setCarregando(false); // Executa sempre, com erro ou não
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Cadastro com geolocalização</Text>

        <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
        <TextInput
          style={styles.input}
          placeholder="Número"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />
        <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
        <TextInput
          style={styles.input}
          placeholder="Estado (ex.: SP)"
          value={estado}
          onChangeText={setEstado}
          autoCapitalize="characters"
          maxLength={2}
        />

        {carregando ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : (
          <Button title="Cadastrar" onPress={cadastrar} />
        )}

        <Text style={styles.contador}>Usuários cadastrados: {usuarios.length}</Text>
      </ScrollView>

      <MapView style={styles.map} region={regiao}>
        {/* Um marcador para cada usuário cadastrado, com o nome no título */}
        {usuarios.map((usuario) => (
          <Marker
            key={usuario.id}
            coordinate={{ latitude: usuario.latitude, longitude: usuario.longitude }}
            title={usuario.nome}
            description={usuario.enderecoCompleto}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flexGrow: 0,
    maxHeight: '50%',
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  contador: {
    marginTop: 8,
    textAlign: 'center',
  },
  map: {
    flex: 1,
  },
});
