module.exports = function karmaConfig(config) {
    config.set({
        frameworks: ["jasmine"],
        reporters: ["progress", "coverage"],
        files: ["build/app/tests.webpack.js"],
        preprocessors: {
            "build/app/tests.webpack.js": ["webpack", "sourcemap"],
        },
        browsers: ["Chrome", "Firefox"],
        singleRun: true,
        coverageReporter: {
            dir: "coverage/",
            reporters: [
                {
                    type: "text-summary"
                }, {
                    type: "html"
                }
            ]
        },
        webpack: require("./webpack.config"),
        webpackMiddleware: {
            noInfo: "errors-only"
        }
    });
};
