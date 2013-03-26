// namespace:
this.argunet = this.argunet||{};

argunet.ArgunetBrowser = function(debateUrl, htmlElement, firstNode, width, height, cssPath){
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
		
		this.browserId = argunet.BrowserRegistry.getInstance().registerBrowser(this);
		
		//load css if this is the compiled version and the stylesheet has not been loaded yet
		//check if this is the compiled version and get the path to Argunet
		var pathToArgunetJs = undefined;
		$("script").each(function(){
			var src= $(this).attr("src");
			var j = -1;
			if(src) j = src.indexOf("ArgunetBrowser.min.js");
			if(j !== -1){
				pathToArgunetJs = $(this).attr("src").substring(0,j);
				return false;
			}
		});
		//check if css has been loaded
		var loaded = false;
		$("link[type='text/css']").each(function(){
			var src= $(this).attr("src");
			if(src)loaded = (src.indexOf("ArgunetBrowser.min.css")!= -1);
			if(loaded){
				return false;
			}
		});

		if(pathToArgunetJs && !loaded){
			var url = cssPath;
			if(!url) url = pathToArgunetJs+'ArgunetBrowser.min.css';
			if(document.createStyleSheet) {
				try { document.createStyleSheet(url); } catch (e) { }
			}
			else {
			    var css;
			    css         = document.createElement('link');
			    css.rel     = 'stylesheet';
			    css.type    = 'text/css';
			    css.media   = "all";
			    css.href    = url;
			    document.getElementsByTagName("head")[0].appendChild(css);
			}
		}
		
		//feature check
		if(!Modernizr.canvas || !Modernizr.canvastext || !({}).__defineGetter__){
			new argunet.ErrorMessageView(htmlElement,width,height, "Argunet Browser not initialized", "We detected that your browser lacks features <a href='http://www.argunet.org'>Argunet Browser</a> depends on. Please use an up-to-date browser that supports HTML5, CSS3 and the Canvas Element.");
			return;
		}
		//loading screen
		this.argunetView = new argunet.ArgunetBrowserView(htmlElement,width,height, this.browserId);
		
		
		var firstNodeId = firstNode;	
		var that = this;
		
		//Load XML File (this could cause problems with IE)
		$.ajax({
			type:'GET',
			url: debateUrl,
			dataType: "XML",
					success : function(response) 
					{
						var xml;
						if ( !window.DOMParser ) { //Internet Explorer
							xml = new ActiveXObject("Microsoft.XMLDOM");
							xml.async = false;
							xml.loadXML(response);
						} else {
							xml = response;
						}
						xml = $(response);
						that.onDebateLoad(xml);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) 
					{
						//remove loading
						that.argunetView.removeLoadingSpinner();
						new argunet.ErrorMessageView(htmlElement,width,height, 'Data Could Not Be Loaded', textStatus);
					}
		});				
		this.onDebateLoad = function(xml){
			//Models
			this.debateManager = new argunet.DebateManager();	        	    
			this.debateManager.loadDebate(xml);					
			
			//Views
			this.debateListView = this.argunetView.debateListView;			
			this.debateListController = new argunet.DebateListController(this.debateListView, this.debateManager);
			
			
			this.arborView = new argunet.ArborView(this.debateManager);
			this.argunetView.setCanvasView(this.arborView);
			
			//Controllers
			this.arborController = new argunet.ArborController(this.arborView,this.debateManager);
			this.debateListView.addEventListener("nodeSelection",this.arborController);
			
			this.history = new argunet.History();
			
			//deactivate tooltip on mousedown
			this.arborView.addEventListener("mousedown",this.argunetView);
			
			this.argunetView.navigationBar.addEventListener("back",this.history);
			this.argunetView.navigationBar.addEventListener("home",this.history);
			this.argunetView.navigationBar.addEventListener("forward",this.history);
			this.argunetView.navigationBar.addEventListener("graphDepthChange",this.arborController);
			
			
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
			if(firstNodeId==undefined)$.each(this.debateManager.nodes,function(){
				firstNodeId=this.id; 
				return false;
				});
			
			//problem cases for testing:
			//firstNodeId = "n1::n2";
			//firstNodeId = "n26";

			this.selectNode(firstNodeId);
		};		

			
		this.handleEvent = function(evt){
			if(evt.type == "historyChange"){
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
			this.history.selectNode(nodeId);
		};
	};
