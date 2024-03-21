/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}
/**
 * @desption - 配置scss变量自动化导入 => 样式文件全局引入( 用于颜色、变量、mixin 等 )
 */
function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, './src/styles/index.scss')],
    });
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: config => {
    config.resolve.alias['@'] = resolve('src');

    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path]_[name].gz[query]',
        algorithm: 'gzip',
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        test: new RegExp('\\.(' + ['js'].join('|') + ')$'),
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false, // 删除原文件,删除未压缩的文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false
      }),
    );


    //打包文件大小配置
    config['performance'] = {
      maxEntrypointSize: 10000000,
      maxAssetSize: 30000000,
    };
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader');

    config.optimization.minimizer('terser').tap(args => {
      Object.assign(args[0].terserOptions.compress, {
        pure_funcs: ['console.log'],
      });
      return args;
    });
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)));
  },
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 8001,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
};
