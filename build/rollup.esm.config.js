import vue from "rollup-plugin-vue";

import buble from '@rollup/plugin-buble';

import filesize from "rollup-plugin-filesize";
import {uglify} from "rollup-plugin-uglify";

import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

export default {
  input: "src/vue-autosuggest.js",
  plugins: [
    vue({ compileTemplate: true, css: false }),
    json(),
    buble({
      objectAssign: "Object.assign",
      jsx: "h"
    }),
    replace({
      "process.env": JSON.stringify({
        NODE_ENV: "production"
      })
    }),
    uglify(),
    filesize(),
  ],
  output: [
    {
      file: `dist/vue-autosuggest.esm.js`,
      format: "es"
    }
  ]
};
