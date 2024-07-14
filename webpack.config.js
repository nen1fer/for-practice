const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: './src/index.js', // точка входа вашего приложения
    output: {
        path: path.resolve(__dirname, 'dist'), // путь к выходной директории
        filename: 'bundle.js', // имя выходного файла
        publicPath: '/dist/' // публичный путь для загрузки ресурсов
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify')
    }
    },
    plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })
  ]
};



