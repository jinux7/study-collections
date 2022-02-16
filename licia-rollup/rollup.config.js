import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import babel from 'rollup-plugin-babel'; 
import { uglify } from 'rollup-plugin-uglify'; 

const env = process.env.NODE_ENV;
const config = {
  input: 'index.js',
  output: [
    { name: '$nux', file: './dist/nux-iife.js', format: 'iife' },
    { name: '$nux', file: './dist/nux-umd.js', format: 'umd' },
    { name: '$nux', file: './dist/nux-cjs.js', format: 'commonjs' },
    { name: '$nux', file: './dist/nux-es.js', format: 'es' },
  ],
  plugins: [
    resolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module
    // babel({
    //   exclude: '**/node_modules/**'
    // }),
  ]
};

if (env === 'production') {
  // config.output.file = './dist/nux-utils.min.js';
  config.plugins.push(
    uglify({
      // mangle: false // 不混淆一些代码的变量名
    })
  )
}

export default config