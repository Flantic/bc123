import webpack from 'webpack'
import webpackConfig from './webpack.conf'

const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
	if (err) {
		console.error(err.stack || err);
		if (err.details) {
			console.error(err.details);
		}
		return;
	}
	const info = stats.toJson();
	if (stats.hasErrors()) {
		console.error(info.errors);
	}
	if (stats.hasWarnings()) {
		console.warn(info.warnings)
	}

	console.log(stats.toString({
		assets: true,// 增加资源信息
		chunks: false,  // 使构建过程更静默无输出
		colors: true,    // 在控制台展示颜色
		cached: false,// 增加缓存了的（但没构建）模块的信息
		cachedAssets: false,// Show cached assets (setting this to `false` only shows emitted files)
		entrypoints: true,// Display the entry points with the corresponding bundles
	}));
})