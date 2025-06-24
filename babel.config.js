module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@': '.',
            '@components': './src/components',
            '@screens': './src/screens',
            '@assets': './assets',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@constants': './src/constants',
            '@theme': './src/theme',
            '@types': './src/types',
            '@images': './src/constants/images',
            '@fonts': './src/constants/fonts',
            '@icons': './src/constants/icons',
            '@providers': './src/providers'
          },
        },
      ],
    ],
  };
};
