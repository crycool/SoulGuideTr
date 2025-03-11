module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true
      }]
      // Not: Module resolver eklentisini geçici olarak devre dışı bıraktık 
      // Çünkü bu eklenti metro ile sorun yaratabilir.
    ]
  };
};