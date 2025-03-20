import typescript from '@rollup/plugin-typescript';

export default {
  input: 'ts/game.ts',
  output: {
    file: 'dist/game.js',
    format: 'es' // Génère du code ES6 utilisable dans un navigateur moderne
  },
  plugins: [typescript({
    compilerOptions: {
      target: "ES5",
      module: "ESNext",
      removeComments: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      esModuleInterop: true,
      preserveConstEnums: false
    }
  })]
};