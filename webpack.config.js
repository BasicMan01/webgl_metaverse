const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	devtool: false,
	entry: [
		'./src/client/js/app.js'
	],
	experiments: {
		asyncWebAssembly: true
	},
	output: {
		path: require('path').resolve('./client'),
		filename: './js/app.js'
	},
	performance: {
		maxAssetSize: 1000000,
		maxEntrypointSize: 1000000,
		assetFilter: function (assetFilename) {
			return assetFilename.endsWith('.js');
		}
	},
	plugins: [
		new Dotenv(),
		new CopyPlugin({
			patterns: [
				{
					from: './src/client/form.html',
					to: './'
				},
				{
					from: './src/client/index.html',
					to: './'
				},
				{
					from: './src/client/css/',
					to: './css/'
				},
				{
					from: './node_modules/three/examples/jsm/libs/ammo.wasm.js',
					to: './js/lib/'
				},
				{
					from: './node_modules/three/examples/jsm/libs/ammo.wasm.wasm',
					to: './js/lib/'
				},
				{
					from: './src/client/resources/',
					to: './resources/'
				}
			]
		})
	]
};

/*
"scripts": {
    "watch-all": "npm run watch-server & npm run watch-client & nodemon --inspect private/server.js",
    "watch-server": "tsc -p tsconfig.json -inlineSourceMap -outDir private --watch",
    "watch-client": "webpack --watch",
  }
*/