// {
//   "presets": [
//     [
//       "env",
//       {
//         "targets": {
//           "browsers": ["last 1 versions"]
//         },
//         "modules": "umd"
//       }
//     ]
//   ],
//   "plugins": [
//     "transform-object-rest-spread",
//     "transform-vue-jsx",
//     [
//       "transform-runtime",
//       {
//         "polyfill": true,
//         "regenerator": true
//       }
//     ]
//   ]
// }


module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env", {
        targets: {
          "browsers": ["last 1 versions"],
          "node": "current"
        }
      },
    ],
    "@vue/babel-preset-jsx"
  ];


  // const plugins = [
  //   "transform-object-rest-spread",
  //   "transform-vue-jsx",
  //   [
  //     "transform-runtime",
  //     {
  //       "polyfill": true,
  //       "regenerator": true
  //     }
  //   ]
  // ];

  const plugins = [
    // "@babel/plugin-proposal-object-rest-spread",
    "@vue/babel-plugin-transform-vue-jsx",
    [
      "@babel/plugin-transform-runtime", {
        "regenerator": true
      }
    ]
    // [
    //   "@babel/plugin-transform-runtime",
    //   {
    //     "corejs": 3,
    //     "regenerator": true
    //   }
    // ]

  ];


  return {
    presets,
    plugins
  };
}

