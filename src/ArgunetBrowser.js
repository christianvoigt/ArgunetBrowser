// namespace:
this.argunet = this.argunet||{};

argunet.ArgunetBrowser = function(data, container, firstNode, width, height, jsUrl, cssUrl, embedded){
//also callable with ArgunetBrowser({data:, container:, firstNode:, width:, height:, jsUrl:, cssUrl:, embedded:});
		if (typeof data=='object'){
			var _p = data;
			data = _p.data;
			container = _p.container;
			firstNode = _p.firstNode;
			width = _p.width;
			height = _p.height;
			jsUrl = _p.jsUrl;
			cssUrl = _p.cssUrl;
			embedded = _p.embedded || true;
		}		
		//width = width || 640;

		height = height || 385;
		cssUrl = cssUrl || "http://christianvoigt.github.com/ArgunetBrowser/lib/ArgunetBrowser.min.css";
		this.initialGraphDepth = 1;
		var that = this;
		
		//if data is undefined, we will look for argument map data in container. This means we should hide everything there, since we will visualize it in Argunet Browser.
		if(!data) $(container).children().hide();

				
		// mix-ins:
		// EventDispatcher methods:
		var p= argunet.ArgunetBrowser.prototype;
		p.addEventListener = null;
		p.removeEventListener = null;
		p.removeAllEventListeners = null;
		p.dispatchEvent = null;
		p.hasEventListener = null;
		p._listeners = null;
		createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.

		this.w = (embedded)? window.parent : window;
		
		//fix firefox iframe issue (show is not working if iframe is set to display:none)
		$("#lightningjs-argunet",this.w.document).css("display","block").css("width","0").css("height","0").css("frameborder","0");
		
		//find container
		this.browserId = argunet.BrowserRegistry.getInstance(this.w).registerBrowser(this);
		if(container){
			this.container = (typeof container == 'string')? $(container,this.w.document).get(0) : container;
		}else{
			var scriptTag = argunet.BrowserRegistry.getInstance(this.w).getScriptTag(this.browserId);
			$(scriptTag).after("<div></div>");
			this.container = $(scriptTag).next("div").get(0);
		}


		
		//feature check
		if(!Modernizr.canvas || !Modernizr.canvastext || !({}).__defineGetter__){
			new argunet.ErrorMessageView(container,width,height, "Argunet Browser not initialized", "We detected that your browser lacks features <a href='http://www.argunet.org'>Argunet Browser</a> depends on. Please use an up-to-date browser that supports HTML5, CSS3 and the Canvas Element.");
			return;
		}		
				
		
		//load css if this is the compiled version and the stylesheet has not been loaded yet
		//check if this is the compiled version and get the path to Argunet
		if(!jsUrl){
			$("script").each(function(){
				var src= $(this).attr("src");
				var j = -1;
				if(src) j = src.indexOf("ArgunetBrowser.embed.min.js");
				if(j !== -1){
					jsUrl = $(this).attr("src").substring(0,j);
					return false;
				}
			});
		}
		this.jsUrl = jsUrl;
		
		//check if css has been loaded
		var loaded = false;
		$("link[type='text/css']",this.w.document).each(function(){
			var src= $(this).attr("src");
			if(src)loaded = (src.indexOf("ArgunetBrowser.min.css")!= -1);
			if(loaded){
				return false;
			}
		});

		if(this.jsUrl && !loaded){
			var url = cssUrl;
			if(!url) url = this.jsUrl+'ArgunetBrowser.min.css';
			if(this.w.document.createStyleSheet) {
				try { this.w.document.createStyleSheet(url); } catch (e) { }
			}
			else {
			    var css;
			    css         = this.w.document.createElement('link');
			    css.rel     = 'stylesheet';
			    css.type    = 'text/css';
			    css.media   = "all";
			    css.href    = url;
			    this.w.document.getElementsByTagName("head")[0].appendChild(css);
			}
		}
		



		this.onDebateLoad = function(){
		
			//Views
			this.debateListView = this.argunetView.debateListView;			
			this.debateListController = new argunet.DebateListController(this.debateListView, this.debateManager);
			
			
			this.arborView = new argunet.ArborView(this.debateManager);
			this.argunetView.setCanvasView(this.arborView);
			
			console.log("scriptPath: "+this.jsUrl+"arbor.js");
			//Controllers
			this.arborController = new argunet.ArborController(this.arborView,this.debateManager, this.jsUrl+"arbor.js");
			this.debateListView.addEventListener("nodeSelection",this.arborController);
			
			this.history = new argunet.History();
			
			//deactivate tooltip on mousedown
			this.arborView.addEventListener("mousedown",this.argunetView);
			
			this.argunetView.navigationBar.addEventListener("back",this.history);
			this.argunetView.navigationBar.addEventListener("home",this.history);
			this.argunetView.navigationBar.addEventListener("forward",this.history);
			this.argunetView.navigationBar.addEventListener("graphDepthChange",this.arborController);
			this.addEventListener("graphDepthChange",this.arborController);
			this.addEventListener("graphDepthChange", this.argunetView.navigationBar);
			this.argunetView.navigationBar.addEventListener("graphDepthChange",this.argunetView.navigationBar);
			
			
			this.arborView.addEventListener("showTooltip",this.argunetView);
			this.arborView.addEventListener("hideTooltip",this.argunetView);
			this.arborView.addEventListener("mousedown",this.argunetView);

			
			this.history.addEventListener("historyChange",this);			
			this.history.addEventListener("historyChange",this.arborController);

			this.debateListView.addEventListener("nodeSelection",this);
			this.debateListView.addEventListener("openGroup",this.arborController);
			this.arborView.addEventListener("openGroup",this.arborController);
			this.debateListView.addEventListener("closeGroup",this.arborController);
			this.debateListView.addEventListener("openAllGroups",this.arborController);
			this.debateListView.addEventListener("closeAllGroups",this.arborController);
			
			this.arborView.addEventListener("nodeSelection",this);
			this.arborView.addEventListener("mousedown",this);
			this.arborView.addEventListener("dblclick",this);			
			
			//remove loading
			this.argunetView.removeLoadingSpinner();
			
			//Select first node
			if(this.firstNodeId==undefined) this.firstNodeId = $.each(this.debateManager.nodes,function(){
				that.firstNodeId=this.id; 
				return false;
			});
			this.initialized = true;
			
			this.selectNode(this.firstNodeId);
			
			this.setGraphDepth(this.initialGraphDepth);
			
			
		};		

			
		this.handleEvent = function(evt){
			if(evt.type == "debateLoaded"){
				this.onDebateLoad();
			}else if(evt.type == "error"){
				//remove loading
				this.argunetView.removeLoadingSpinner();
				new argunet.ErrorMessageView(container,width,height, 'Error', evt.textStatus);				
			}else if(evt.type == "historyChange"){
				this.argunetView.navigationBar.setBackwardEnabled(this.history.backwardEnabled);
				this.argunetView.navigationBar.setForwardEnabled(this.history.forwardEnabled);
				this.argunetView.navigationBar.setHomeEnabled(this.history.homeEnabled);

			}else if(evt.type == "nodeSelection"){
				this.history.selectNode(evt.nodeId);
				this.dispatchEvent({type:"nodeSelection",nodeId:evt.nodeId},evt.target);
			}else if(evt.type == "mousedown"){
				this.dispatchEvent(evt, evt.target);
			}else if(evt.type =="dblclick"){
				this.dispatchEvent(evt, evt.target);
			}
		};
		
		this.selectNode = function(nodeId){
			if(this.initialized)this.history.selectNode(nodeId);
			else this.firstNodeId = nodeId;
		};
		this.setGraphDepth = function(depth){
			if(this.initialized){
				this.dispatchEvent({type:"graphDepthChange", value:depth},this);
			}else{
				this.initialGraphDepth = depth;
			}
		};

		this.loadDebate = function(){			
			//loading screen
			this.argunetView = new argunet.ArgunetBrowserView(this.container,width,height, this.browserId);
			this.firstNodeId = firstNode;	
			
			//Models
			this.debateManager = new argunet.DebateManager(this.container);	  
			this.debateManager.addEventListener("debateLoaded",this);
			this.debateManager.addEventListener("error",this);
			this.debateManager.loadDebate(data);	
		};		
		//if ArgunetBrowser's parent element is hidden, the canvas width will be set to 0, because hidden elements have no widths and the ArgunetBrowser's width is set to 100%
		//To avoid this, check if ArgunetBrowser is hidden. If so, poll for display event. This isn't nice, but there is no javascript event we could use
		if($(this.container).is(":hidden")){
			var hiddenTimeout;
			
			var checkIfHidden = function(){
				console.log("timeout");
				if(!$(that.container).is(":hidden")){
					that.loadDebate();
					
					clearTimeout(hiddenTimeout);
				}else{
					hiddenTimeout = setTimeout(checkIfHidden,100);
				}
			}
			checkIfHidden();
		}else{
			this.loadDebate();
		}		
		
	};
