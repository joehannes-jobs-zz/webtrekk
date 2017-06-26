module.exports = function karmaConfig(config) {
    config.set({
        frameworks: ["jasmine"],
        reporters: ["progress", "coverage"],
        files: ["client/tests.webpack.js"],
        preprocessors: {
            "client/tests.webpack.js": ["webpack", "sourcemap"],
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
        },
        plugins: [
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-webpack",
            "karma-sourcemap-loader",
            "karma-jasmine",
            "karma-coverage",
            "karma-spec-reporter"
        ]
    });
};
