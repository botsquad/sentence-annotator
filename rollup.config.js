import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import postcss from 'rollup-plugin-postcss'

// PostCSS plugins
import simplevars from 'postcss-simple-vars'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'

const pkg = require('./package.json')

const libraryName = 'sentence-annotator'

export default {
  input: `src/index.tsx`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['react', 'react-dom', '@blueprintjs/core', 'lodash'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    postcss({
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false, }),
        cssnano(),
      ],
      extensions: [ '.css' ],
    }),

    // Allow json resolution
    json(),

    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      include: 'node_modules/**',
      namedExports:
      {
        './node_modules/react/index.js':
        [
          'React',
          'cloneElement',
          'createRef',
          'createElement',
          'PropTypes',
          'Children',
          'Component',
          'PureComponent',
        ],
        './node_modules/lodash/lodash.js':
        [
          'cloneDeep',
          'defaults'
        ],
        './node_modules/react-dom/index.js':
        [
          'render',
          'findDOMNode',
          'createPortal',
          'unstable_renderSubtreeIntoContainer',
          'unmountComponentAtNode',
        ],
      }
    }),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
