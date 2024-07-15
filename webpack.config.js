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
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        open: true,
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
            },
            {
                test: /\.css$/, // добавьте это правило, если у вас есть CSS файлы
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/i, // добавьте это правило для обработки изображений
                type: 'asset/resource',
            },
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



