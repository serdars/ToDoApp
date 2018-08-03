const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess.withLoaderOptions({
      modifyVars: {
          //"@primary-color": "#001529",
          //"@normal-color": "#001529",
          "@layout-body-background": "#FFFFFF",
          //"#001529"
          "@layout-header-background": "#4F81BD",
      },
      javascriptEnabled: true
    })(config, env);
    return config;
};
