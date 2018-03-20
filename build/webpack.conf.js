import webpack from 'webpack'
import glob from 'glob'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'

var Context = process.env.NODE_ENV
var isDevelopment = Context == "development"
var BaseUrl = path.resolve(__dirname, '../src')
var Output = path.resolve(__dirname, '../dist')
var assetsPath = ''

const Util = {
	resolve: (dir) => { return path.join(__dirname, '..', dir) },
	assetsPath: (_path) => { return path.posix.join(assetsPath, _path) }
}

var files = glob.sync('./src/**/*.js')
var newEntry = {}
var htmlTemp = []

files.forEach(function (item) {
	var name = path.basename(item, '.js');
	newEntry[name] = item
	htmlTemp.push(new HtmlWebpackPlugin({
		filename: `${Output}/temp/${name}.html`,
		template: `${BaseUrl}/temp/${name}.html`,
		chunks: ['vendor', 'common', name],
		chunksSortMode: 'manual',
		inject: true,
		minify: {
			removeComments: isDevelopment,
			collapseWhitespace: isDevelopment,
			removeAttributeQuotes: isDevelopment
		},
	}))
})


var webpackConfig = {
	entry: newEntry,
	output: {
		path: Output,
		filename: 'js/[name].[chunkhash:6].js',
		publicPath: assetsPath,
		// chunkFilename: `${Output}/js/[id].[chunkhash:6].js`
	},
	resolve: {
		extensions: ['.js', '.json', '.sass'],
		alias: {
			'@': Util.resolve('src')
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader']
			}, {
				test: /\.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})
			}, {
				test: /\.js$/,
				loader: 'babel-loader',
				include: [Util.resolve('src')],
				exclude: /node_modules/
			}, {
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: Util.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: Util.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}, {
				test: /\.html$/,
				use: {
					loader: 'html-loader'
				}
			},
			{
				test: require.resolve('jquery'),
				loader: 'expose-loader?$!expose-loader?jQuery', // jQuery and $
			},
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': process.env.NODE_ENV
		}),
		//JS压缩混淆精简
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: isDevelopment,
			compress: {
				warnings: false,
				drop_debugger: true,
				drop_console: true
			}
		}),
		//提取css文件
		new ExtractTextPlugin({
			filename: Util.assetsPath('css/[name].[contenthash:6].css')
		}),
		//清理dist文件夹上次生成内容
		new CleanWebpackPlugin(path.resolve(__dirname, '../dist'), {
			root: path.resolve(__dirname, '../'),    // 设置root
			verbose: true
		}),
		//css压缩
		new OptimizeCSSPlugin(),
		//提取库文件
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module, count) {
				// any required modules inside node_modules are extracted to vendor
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(
						path.join(__dirname, '../node_modules')
					) === 0
				)
			}
		}),
		//在库文件基础上进一步提取公共文件
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			chunks: ['vendor']
		}),
		//copy静态资源
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: `${Output}/static/`,
				ignore: ['.*']
			}
		])
	],
}

webpackConfig.plugins.push(...htmlTemp)

if (isDevelopment) {
	webpackConfig.plugins.push(new FriendlyErrorsPlugin())
}


export default webpackConfig