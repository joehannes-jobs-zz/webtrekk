const gulp = require('gulp');
const webpack = require('gulp-webpack');
const WebpackDevServer = require('webpack-dev-server');
const wpConfig = require('./webpack.config.js');
const literate = require('gulp-literate');
const watch = require('gulp-watch');
const gutil = require('gulp-util');

const PATH = {
	src: 'literature/**/*.md',
	entry: dest + '/app/app.js',
	assets: 'assets',
	dest: 'build'
}

gulp.task('literature', () => {
    return watch(PATH.src, () => {
		gulp.src(PATH.src)
	        .pipe(literate())
			.pipe(gulp.dest(PATH.build))
	});
});

gulp.task('webpack', () => {
	return watch(PATH.entry)
		.pipe(webpack(wpConfig));
});

gulp.task('wpDevServer', () => {
	var myConfig = Object.create(wpConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;
	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", (err) => {
		if (err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});

gulp.task('serve', ['literature', 'wpDevServer']);
gulp.task('build', ['literature', 'webpack'])
