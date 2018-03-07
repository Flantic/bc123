const gulp = require('gulp')
const webpack = require("gulp-webpack")
const clean = require('gulp-clean')
const sass = require('gulp-sass')
const babel = require("gulp-babel")
const es2015 = require("babel-preset-es2015")
const uglify = require('gulp-uglify')
const cssmin = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const path = require('path')

const resolve = (_path) => path.resolve(__dirname, _path)
const src = resolve('./src')
const dest = resolve('./res')

//gulp 错误处理
function onError(err) {
	console.error(err.toString())
	this.emit('end')
}
//删除css
gulp.task('cleanCss', function () {
	gulp.src([`${dest}/css/*`], { read: false })
		.pipe(clean());
});
//删除js
gulp.task('cleanJs', function () {
	gulp.src([`${dest}/js/*`], { read: false })
		.pipe(clean());
});
//gulp sass文件处理
gulp.task('scss', () => {
	return gulp.src(`${src}/scss/**/*.scss`)
		.pipe(sass())
		.on('error', onError)
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false,
		}))
		.pipe(cssmin())
		.pipe(gulp.dest(`${dest}/css`))
})
//gulp js文件处理
gulp.task('js', () => {
	return gulp.src(`${src}/script/**/*.js`)
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(uglify({ mangle: false }))
		// .pipe(webpack({
		// 	output: {
		// 		filename: "[name].js",
		// 	},
		// 	stats: {
		// 		colors: true
		// 	}
		// }))
		.pipe(gulp.dest(`${dest}/js`))
})
//gulp 监听文件变化响应编译
gulp.task('watch', () => {
	gulp.watch(`${src}/scss/**/*.scss`, ['cleanCss', 'scss'])
	gulp.watch(`${src}/script/**/*.js`, ['cleanJs', 'js'])
})


gulp.task('default', ['scss'])