var gulp = require('gulp');
var tap = require('gulp-tap');
var gWebpack = require('gulp-webpack');
var webpack = require('webpack');
//var compiler = require('webpack-stream');
var WebpackDevServer = require('webpack-dev-server');
var wpConfig = require('./webpack.config.js');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var grun = require('gulp-run');
var fs = require('fs');
var path = require('path');
var runSeq = require('run-sequence');

const PATH = {
	src: 'literature/*.md',
	entry: 'build/app/app.js',
	assets: 'assets',
	dest: 'build'
}

gulp.task('watchLiterature', () => {
    return watch(PATH.src, { ignoreInitial: true }, (vinyl) => {
		return grun('node_modules/.bin/litpro ./literature/' + vinyl.relative).exec();
	});
});

gulp.task('server', (cb) => {
	// Start a webpack-dev-server
	new WebpackDevServer(webpack(wpConfig), {}).listen(8080, "localhost", (err) => {
		if (err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});

gulp.task('compile', (done) => {
	const folder = "./literature";
	var files = fs.readdirSync(folder)
		.filter((file) => fs.lstatSync(path.join(folder, file)).isFile()).length;
	var compiled = 0;
	gulp.src(PATH.src)
		.pipe(tap((vinyl) => {
			grun('node_modules/.bin/litpro ./literature/' + vinyl.relative)
				.exec(() => {
					if (++compiled === files.length)
						done();
				});
		}));
});
gulp.task('webpack', () => {
	return gulp.src(PATH.entry)
		.pipe(gWebpack(wpConfig, webpack));
});
gulp.task('build', (cb) => {
	runSeq('compile', 'webpack', cb);
});

gulp.task('serve', () => {
	runSeq(['watchLiterature', 'server']);
});
