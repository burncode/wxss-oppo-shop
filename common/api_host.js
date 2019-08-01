var configLocal = {
  portalApiHost: 'https://dev.xsili.net/test/api/oppo-shop-wxapp/',
  debug:true
};

var configTest = {
  portalApiHost: 'https://dev.xsili.net/test/api/oppo-shop-wxapp/',
  debug: true
};

var configQa = {
  portalApiHost: 'https://xcx3rd.oppo.cn/',
  debug: false
};

module.exports = {
  // config:configLocal,
  // config: configTest,
  config: configQa,
};

