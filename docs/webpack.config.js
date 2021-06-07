const path = require("path");

// const eslintFriendlyFormatter = require("eslint-friendly-formatter");
const ESLintPlugin = require('eslint-webpack-plugin');

const { VueLoaderPlugin } = require('vue-loader');

module.exports = {

    context: __dirname,
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                test: /\.(js|vue)$/,
                // loader: "eslint-loader",
                // enforce: "pre",
                // options: {
                    // formatter: eslintFriendlyFormatter
                // }
            },

            {
                test: /\.js/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    babelrc: true
                }
            },

            {
                test: /\.vue$/,
                loader: "vue-loader",
                exclude: /node_modules/
            },

            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },


            // this will apply to both plain `.scss` files
            // AND `<style lang="scss">` blocks in `.vue` files
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ]
            },


        ]
    },

    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            vue: "vue/dist/vue.js"
        }
    },

    entry: "./index.js",

    output: {
        path: path.resolve(__dirname, "build"),
        filename: "app.js",
        publicPath: "/build/"
    },

    plugins: [
        new VueLoaderPlugin(),
        new ESLintPlugin()
    ],

    devServer: {
        contentBase: __dirname,
        port: 2000
    }
};
