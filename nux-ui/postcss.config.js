module.exports = {
  plugins: {
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 7']
    // },

    /**
     * postcss-plugin-px2rem 配置
     * 详见官方文档
    */
    'postcss-plugin-px2rem': {
        rootValue: 75, 
        // unitPrecision: 5, 
        // propWhiteList: [],  
        // propBlackList: [], 
        exclude: /(node_module)|(components)/,  
        // selectorBlackList: [], 
        // ignoreIdentifier: false, 
        // replace: true, 
        mediaQuery: false,  
        minPixelValue: 3 
    }
  }
}