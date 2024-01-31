const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	mode: "production", // Set mode to 'production' to enable optimizations
	entry: "./index.js", // Entry point of your library
	output: {
		filename: "fas.min.js", // Output file name
		path: __dirname + "/dist", // Output directory
		library: "fas", // Name of the library
		libraryTarget: "umd", // Universal Module Definition
		umdNamedDefine: true,
	},
	optimization: {
		minimize: true, // Enable code minification
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					ecma: 5, // Target ECMAScript 5
					compress: {
						drop_console: true, // Remove console.* statements
					},
					output: {
						comments: false, // Remove comments
					},
				},
			}),
		],
	},
	target: "node",
};
