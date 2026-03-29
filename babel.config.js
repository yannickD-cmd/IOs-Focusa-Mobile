module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@store': './src/store',
            '@types': './src/types',
            '@utils': './src/utils',
            '@constants': './src/constants',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
