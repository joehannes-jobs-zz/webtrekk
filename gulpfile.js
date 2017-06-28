const gulp = require('gulp');
const tap = require('gulp-tap');
const webpack = require('gulp-webpack');
const compiler = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');
const wpConfig = require('./webpack.config.js');
const watch = require('gulp-watch');
const gutil = require('gulp-util');
const grun = require('gulp-run');
const fs = require('fs');
const path = require('path');
const runSeq = require('run-sequence');

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

gulp.task('server', () => {
	var myConfig = Object.create(wpConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;
	// Start a webpack-dev-server
	new WebpackDevServer(compiler(myConfig), {
		publicPath: myConfig.output.path,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", (err) => {
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

gulp.task('build', ['compile'], () => {
	return gulp.src(PATH.entry)
		.pipe(webpack(wpConfig));
});

gulp.task('serve', () => {
	runSeq(['watchLiterature', 'server']);
});
