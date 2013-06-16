// namespace:
this.argunet = this.argunet||{};

(function() {
	var StaticGraphController= function(view,debateManager) {
		// mix-ins:
		// EventDispatcher methods:
		var p= argunet.StaticGraphController.prototype;
		p.addEventListener = null;
		p.removeEventListener = null;
		p.removeAllEventListeners = null;
		p.dispatchEvent = null;
		p.hasEventListener = null;
		p._listeners = null;
		createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.

		this.debateManager = debateManager;
		this.view = view;
			    
	    view.addEventListener("mousedown",this);

		this.doc= this.view.stage.canvas.ownerDocument;
		this.win= 'defaultView' in this.doc? this.doc.defaultView : this.doc.parentWindow;
	    

		//Fullscreen
		this.doc.addEventListener('fullscreenchange', this);
		this.doc.addEventListener('mozfullscreenchange', this);
		this.doc.addEventListener('webkitfullscreenchange', this);
		this.win.addEventListener('resize', this, false);

	    
	    
		this.selectNode = function(nodeId){
		};	    
		this.update = function(){
			this.view.redraw(this.debateManager.nodes, this.debateManager.edgesBySource, this.debateManager.colors);
		};			 
		
		this.update();
	};
//public methods
	var p = StaticGraphController.prototype; 

	    p.handleEvent = function(evt){		  
	    	if(evt.type == "historyChange"){
				var state = evt.state;
				if(state.type == "nodeSelection"){
					this.selectNode(state.data.nodeId);
				}
			}else if(evt.type == "openGroup"){
				this.debateManager.groups[evt.id].open = true;
				this.update();
			}else if(evt.type == "closeGroup"){
				this.debateManager.groups[evt.id].open = false;
				this.update();
			}else if(evt.type == "openAllGroups"){
				$.each(this.debateManager.groups,function(){
					this.open=true;
				});
				this.update();
			}else if(evt.type == "closeAllGroups"){
				$.each(this.debateManager.groups,function(){
					this.open=false;
				});
				this.update();
			}else if (evt.type == "resize" || evt.type == "fullscreenchange" || evt.type == "mozfullscreenchange" || evt.type == "webkitfullscreenchange" ){
				var that = this;
				
				if(this.doc.mozFullScreen || this.doc.webkitIsFullScreen) {
					that.update();
					this.oldWidth = that.view.stage.canvas.width;
					this.oldHeight = that.view.stage.canvas.height;
				}else if(!this.oldWidth || !this.oldHeight || this.oldWidth != that.view.stage.canvas.width || this.oldHeight != that.view.stage.canvas.height){
					that.update();					
					this.oldWidth = that.view.stage.canvas.width;
					this.oldHeight = that.view.stage.canvas.height;
				}
			}
		};
    argunet.StaticGraphController = StaticGraphController;
}());