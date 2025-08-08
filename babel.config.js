module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@api': './api/MH',
            '@components': './components',
            '@screens': './screens',
            '@assets': './assets',
            '@store': './store',
            '@emoji': './assets/emoji',
          },
        },
      ],
      'react-native-worklets/plugin',  // <-- добавляем сюда
    ],
  };
};