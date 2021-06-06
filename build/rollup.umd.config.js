import vue from "rollup-plugin-vue";
import buble from '@rollup/plugin-buble';
import filesize from "rollup-plugin-filesize";
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';

export default {
  input: "src/vue-autosuggest.js",
  plugins: [
    vue({
      compileTemplate: true,
      css: false
    }),

    replace({
      "process.env": JSON.stringify({
        "NODE_ENV": "production"
      })
    }),

    json(),

    buble({
      transforms: {
        dangerousForOf: true
      },
      objectAssign: "Object.assign",
      jsx: "h"
    }),
    commonjs(),
    terser(),
    filesize()
  ],
  output: [
    {
      name: "VueAutosuggest",
      exports: "named",
      file: `dist/vue-autosuggest.js`,
      format: "umd"
    }
  ]
};
