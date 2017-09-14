var babel = require('rollup-plugin-babel'),
    nodeResolve = require('rollup-plugin-node-resolve'),
    uglify = require('rollup-plugin-uglify');

export default {
  entry: 'src/index.js',
  format: 'iife',
  moduleName: 'template',
  dest: 'template.js',
  sourceMap: true,
  plugins: [
    babel(),
    nodeResolve({ jsnext: true }),
    uglify(),
  ]
};
