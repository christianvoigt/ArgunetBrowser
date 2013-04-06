// namespace:
this.argunet = this.argunet||{};

(function() {
	var StylesheetLoader = function(url, doc, callback) {
		//check if css has already loaded
		var stylesheet = this.findStylesheet(url, doc);
		if(stylesheet) return callback.call();
		
		if(doc.createStyleSheet) {
			try { doc.createStyleSheet(url); } catch (e) { }
		}
		else {
		    var css;
		    css         = doc.createElement('link');
		    css.rel     = 'stylesheet';
		    css.type    = 'text/css';
		    css.media   = "all";
		    css.href    = url;
		    doc.getElementsByTagName("head")[0].appendChild(css);
		}		
		stylesheet = this.findStylesheet(url, doc);
		function poll() { //from https://github.com/SlexAxton/yepnope.js/blob/master/plugins/yepnope.css.js
			try {
		        // this throws an exception, I believe, if not full loaded (was originally just "sheets[j].cssRules;")
				if (stylesheet.cssRules.length){
					return callback.call();
				}
			} catch(e) {
				// Keep polling
		        setTimeout(poll, 20);
		    }
		}
		poll();			
	}
	var p = StylesheetLoader.prototype;
	p.findStylesheet = function(url, doc){
			var result;
            var sheets = doc.styleSheets;
            for(var j=0, k=sheets.length; j<k; j++) {
            	console.log(sheets[j].href);
                if(sheets[j].href == url) {
                	result = sheets[j];
                }
            }
			return result;
	}
    argunet.StylesheetLoader = StylesheetLoader;
}());