// namespace:
this.argunet = this.argunet||{};

argunet.BrowserRegistry = function(w){
    if ( arguments.callee.instance )
        return arguments.callee.instance;
    arguments.callee.instance = this;
    this.w = w;
    this.w.argunet = w.argunet || {};
    this.w.argunet.browsers = w.argunet.browsers || [];
    var getScriptTags = function (){
    	var tags = [];
    	var re = /.*ArgunetBrowser\.load\.([^/]+\.)?js/;
    	$("script",w.document).each(function(){
    		if($(this).attr("src") && $(this).attr("src").match(re)){
    			tags.push(this);
    		}
    	});
    	return tags;
    };
    w.argunet.scriptTags = w.argunet.scriptTags || getScriptTags();
    this.browsers = [];
    this.registerBrowser = function(browser){
    	this.w.argunet.browsers.push(browser);    	
    	return this.w.argunet.browsers.length;
    };
    this.getScriptTag = function(browserId){
    	return this.w.argunet.scriptTags[browserId-1];    	
    };
};


argunet.BrowserRegistry.getInstance = function(w) {
    var browserRegistry = new argunet.BrowserRegistry(w);
    return browserRegistry;
};