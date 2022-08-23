const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLInlineCSSWebpackPlugin =
  require("html-inline-css-webpack-plugin").default;
const fs = require("fs");
const production = process.env.NODE_ENV === "production";

let htmlPageNames = [];
const pages = fs.readdirSync("./src/pages");
pages.forEach((page) => {
  if (page.endsWith(".html")) {
    htmlPageNames.push(page.split(".html")[0]);
  }
});


const entry = htmlPageNames.reduce((entries, page) => {
  entries[page] = path.join(__dirname, `src/pages/${page}.js`);
  return entries;
}, {});



let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/pages/${name}.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
  });
});

const config = {
  entry,
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "esbuild-loader",
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { url: false } },
          "postcss-loader",
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    watchFiles: ["src/**/*"],
    compress: true,
    port: 8080,
  },
  watchOptions: {
    aggregateTimeout: 200,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    // new HtmlWebpackPlugin({
    //   template: "src/index.html",

    // }),
    new CopyPlugin({
      patterns: [{ from: "src/static", to: "static" }],
    }),
  ].concat(multipleHtmlPlugins),
  mode: production ? "production" : "development",
  stats: production ? "normal" : "minimal",
};

if (production) {
  config.optimization = {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        css: true,
      }),
    ],
  };

  config.plugins.push(new HTMLInlineCSSWebpackPlugin());
}

module.exports = config;
