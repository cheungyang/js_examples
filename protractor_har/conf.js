var Proxy = require('browsermob-proxy').Proxy;
var Q = require('q');

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  capabilities: {
    browserName: 'firefox',
    proxy: {
      proxyType: 'manual',
      httpProxy: 'localhost:8888',
      sslProxy: 'localhost:8888'
    }
  },

  specs: [
  	//'getXHR-spec.js',
  	'getHAR-spec.js'
  ],

  onPrepare: function () {
    var proxy = new Proxy();
    return Q.ninvoke(proxy, 'start', 8888).then(function (data) {
      browser.params.proxy = proxy;
      browser.params.proxyData = data;
      return data;
    }, function () {
      console.log('start failed');
    });
  },

  onComplete: function () {
    return Q.ninvoke(browser.params.proxy, 'stop', browser.params.proxy);
  }
};