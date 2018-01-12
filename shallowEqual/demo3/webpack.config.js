const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
	entry: './src/app.js',
	/*entry: {
	    app: './src/app.js',
	    search: './src/search.js'
	}*/
	devtool: 'inline-source-map',
	devServer: {
	    	contentBase: './dist',
	    	port: 3000
   	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
     	new HtmlWebpackPlugin({
       	title: 'webpack learn'
    	})
   	],
	output: {
	    //filename: '[name].js',
	    filename:'bound.js',
	    path: __dirname + '/dist'
	},
	module: {
	    rules: [
	    	{
		        test: /\.tpl$/,
		        use: [ 'myloader' ]
		    }
	    ]
  	}
};

module.exports = config;