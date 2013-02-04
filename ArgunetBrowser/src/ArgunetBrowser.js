// namespace:
this.argunet = this.argunet||{};

argunet.ArgunetBrowser = function(debateUrl, htmlElement, firstNode, width, height){
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
<<<<<<< HEAD
		
		//create this early to show loading screen
		this.argunetView = new argunet.ArgunetBrowserView(htmlElement,width,height, this.browserId);
		
		
		var debateUrl = debateUrl;
		var firstNodeId = firstNode;	
		var that = this;
		
		//Load XML File (this could cause problems with IE)
		$.ajax({
			type:'GET',
			url: debateUrl,
			dataType: "xml",
					success : function(response) 
					{
						xml = $(response);
						that.onDebateLoad(xml);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) 
					{
						alert('Data Could Not Be Loaded - '+ textStatus);
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

			this.history.selectNode(firstNodeId);
		};		
		this.handleEvent = function(evt){
			if(evt.type == "historyChange"){
				this.argunetView.navigationBar.setBackwardEnabled(this.history.backwardEnabled);
				this.argunetView.navigationBar.setForwardEnabled(this.history.forwardEnabled);
				this.argunetView.navigationBar.setHomeEnabled(this.history.homeEnabled);
=======
		console.log("browserId: "+this.browserId);
		
		var debateUrl = debateUrl;
		var firstNodeId = firstNode;	
		var that = this;
		
		//Load XML File (this could cause problems with IE)
		$.ajax({
			type:'GET',
			url: debateUrl,
			dataType: "xml",
					success : function(response) 
					{
						xml = $(response);
						that.onDebateLoad(xml);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) 
					{
						alert('Data Could Not Be Loaded - '+ textStatus);
					}
		});				
		this.onDebateLoad = function(xml){
			//Models
			this.debateManager = new argunet.DebateManager();	        	    
			this.debateManager.loadDebate(xml);					
			
			//Views
			this.argunetView = new argunet.ArgunetBrowserView(htmlElement,width,height, this.browserId);
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
			
			//Select first node
			if(firstNodeId==undefined)$.each(this.debateManager.nodes,function(){
				firstNodeId=this.id; 
				return false;
				});
			
			//problem cases for testing:
			//firstNodeId = "n1::n2";
			//firstNodeId = "n26";

			this.history.selectNode(firstNodeId);
		};		
		this.handleEvent = function(evt){
			if(evt.type == "historyChange"){
				this.argunetView.navigationBar.setBackwardEnabled(this.history.backwardEnabled);
				this.argunetView.navigationBar.setForwardEnabled(this.history.forwardEnabled);
				this.argunetView.navigationBar.setHomeEnabled(this.history.homeEnabled);
				console.log("history changed "+this.history.backwardEnabled);
>>>>>>> refs/remotes/choose_remote_name/master
			}else if(evt.type == "nodeSelection"){
				this.history.selectNode(evt.nodeId);
				this.dispatchEvent({type:"nodeSelection",nodeId:evt.nodeId},evt.target);
			}
		};
	};
