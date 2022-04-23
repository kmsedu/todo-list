const HtmlWebPackPlugin = require('html-webpack-plugin');

const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/i,
        type: 'asset/resource'
      }
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new HtmlWebPackPlugin({
    template: 'src/index.html',
  })],
};