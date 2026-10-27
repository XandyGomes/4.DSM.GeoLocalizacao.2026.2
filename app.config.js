// Lê a chave do Google Maps do arquivo .env e injeta o plugin do react-native-maps
module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    [
      "react-native-maps",
      { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY },
    ],
  ],
});
