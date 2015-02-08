describe('get HAR tests', function () {
  beforeEach(function (done) {
    browser.ignoreSynchronization = true;
    browser.params.proxy.startHAR(browser.params.proxyData.port, 'test', done);
  });

  it('should contain a HAR with images', function () {
    var urls = null;

    function _waitForDOMReady() {
      return browser.wait(function () {
        return browser.executeScript('return document.readyState').then(function(status) {
          return status === 'complete';
        }, function() {
          return browser.executeScript('return document.readyState').then(function(status) {
            return status === 'complete';
          });
        });
      });
    }

    function _getLatestUrls(callDateUtcTime, callback) {
      var deferred = protractor.promise.defer();
      browser.params.proxy.getHAR(browser.params.proxyData.port, function (err, harStr) {
        var har = JSON.parse(harStr);
        var urls = [];
        for (var i=0, j=har.log.entries.length-1; i<j; i++) {
          var entry = har.log.entries[i];
          var req = entry.request;
          var entryDate = new Date(entry.startedDateTime);
          if (entryDate.getTime() > callDateUtcTime && req.url.match(/geo.yahoo.com/)) {
            urls.push(req.url);
          }
        }
        deferred.fulfill(urls);
      });
      return deferred.promise;
    }

    function _waitForNewNetworkConnections(callDate) {
      return browser.wait(function(){
        return _getLatestUrls(callDate).then(function(inUrls){
          urls = inUrls;
          return inUrls.length > 0;
        }, function() {
          return _getLatestUrls(callDate).then(function(inUrls){
            urls = inUrls;
            return inUrls.length > 0;
          });
        });
      });
    }

    browser.get('https://news.yahoo.com');

    _waitForDOMReady().then(function() {
      element(by.id('yucs-more')).click();
    });

    var callDate = new Date();
    var callDateUtcTime = callDate.getTime() - (callDate.getTimezoneOffset() * 60000);
    _waitForNewNetworkConnections(callDateUtcTime).then(function() {
      console.log("URLS:\n" + urls.join("\n"));
      expect(urls.length).toEqual(1);
    });
  });
});