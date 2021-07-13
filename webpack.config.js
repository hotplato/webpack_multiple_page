const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const glob = require('glob')
const { argv } = require('process')

const getEntries = () => {
  const entries = {}
  const templates = []
  const files = glob.sync(path.resolve(__dirname, 'src', './**/*.js'))
  for (let i = 0; i < files.length; i++) {
    const filename = files[i]
    const parsePath = path.parse(filename)
    const key = parsePath.name
    entries[key] = filename
    templates.push(
      new HtmlWebpackPlugin({
        filename: key + '.html',
        chunks: [key],
        template: path.resolve(parsePath.dir, `${key}.html`),
      })
    )
  }
  return { entries, templates }
}
const IS_PROD =
  argv[argv.indexOf('--mode') + 1] === 'production' ||
  process.env.NODE_ENV === 'production'

const { entries, templates } = getEntries()

module.exports = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: IS_PROD ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    chunkFilename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.js'],
  },
  devtool: 'source-map',
  plugins: [
    ...templates,
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' }),
  ],
}
