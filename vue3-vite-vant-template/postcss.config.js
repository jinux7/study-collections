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
        propBlackList: ['font-size'], // 不转换的样式
        exclude: /(node_module)/,  
        // selectorBlackList: [], 
        // ignoreIdentifier: false, 
        // replace: true, 
        mediaQuery: false,  
        minPixelValue: 3 
    }
  }
}