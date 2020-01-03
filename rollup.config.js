// Rollup plugins.
import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import json from 'rollup-plugin-json';
import less from 'rollup-plugin-less';

import pkg from './package.json';
const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: {
    name: 'react-ahax',
    file: pkg.main,
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },
  external: ['react', 'react-dom'],
  plugins: [
    resolve({
      browser: true,
      main: true
    }),
    cjs({
      exclude: 'src/**'
    }),
    less({
      output: './lib/index.css'
    }),
    json(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['es2015', { modules: false }], 'stage-0', 'react'],
      plugins: ['external-helpers']
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    filesize(),
    progress(),
    isProduction && uglify()
  ]
};
