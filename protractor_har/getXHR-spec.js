describe('get XHR tests', function() {
  it('should intercept URL from ajax call', function() {
  	browser.ignoreSynchronization = true;
  	browser.get('https://news.yahoo.com');
  	//browser.get('http://localhost:1337');
    
    browser.driver.executeAsyncScript(function(callback) {
    	(function(open) {
		    // Warning: does no support IE6
			// See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

		  XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
		    open.call(this, method, url, async, user, pass);
		    setTimeout(
		    callback(url), 1000);
		  };
		})(XMLHttpRequest.prototype.open);
	}).then(function(result) {
	    console.log('URL: '+ result);
	    //expect(result).toEqual('http://localhost:1337/data');
	    expect(result).toContain('geo.query.yahoo.com');
	});
  });
});