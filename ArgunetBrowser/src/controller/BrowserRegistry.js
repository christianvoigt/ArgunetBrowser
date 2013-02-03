// namespace:
this.argunet = this.argunet||{};

argunet.BrowserRegistry = function(){
    if ( arguments.callee.instance )
        return arguments.callee.instance;
    arguments.callee.instance = this;
    this.browsers = [];
    this.registerBrowser = function(browser){
    	this.browsers.push(browser);
    	return "argunetBrowser-"+this.browsers.length;
    };
};


argunet.BrowserRegistry.getInstance = function() {
    var browserRegistry = new argunet.BrowserRegistry();
    return browserRegistry;
};