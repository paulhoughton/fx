import typescript from 'rollup-plugin-typescript';

export default {
  entry: './Main.tsx',
  dest: './bundle.js',
  format: 'iife',
  plugins: [
    typescript()
  ],
  external: ['react','react-dom'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
}