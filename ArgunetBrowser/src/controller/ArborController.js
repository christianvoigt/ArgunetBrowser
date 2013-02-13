// namespace:
this.argunet = this.argunet||{};

/*
ArborController is responsible for selecting the nodes and edges that make up the visible graph given a selected node and a graph depth. 
The visible graph is given to Arbor. 
Arbor then calculates the position of the nodes and calls the redraw method of ArborView.
*/
(function() {
	var ArborController= function(arborView,debateManager) {
		// mix-ins:
		// EventDispatcher methods:
		var p= argunet.ArborController.prototype;
		p.addEventListener = null;
		p.removeEventListener = null;
		p.removeAllEventListeners = null;
		p.dispatchEvent = null;
		p.hasEventListener = null;
		p._listeners = null;
		createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.

		this.debateManager = debateManager;
		
	    var sys = arbor.ParticleSystem(400, 400, 0.7, true, 55, 0.03);
	    sys.parameters({integrator:'euler'});
	    
	    var configurator = new argunet.ArborConfigurator(sys, arborView.stage.canvas.width, arborView.stage.canvas.height);
	    
	    arborView.addEventListener("mousedown",this);
	    sys.renderer = arborView;
	    
		this.graphDepth = 1;
		
	    var visibleNodes = {};
	    var visibleEdges = {};
	    var selectedNode = undefined;
	    
	    
	    //Private Methods
	    
		this.addNodeToVisibleGraph = function(id,edgesToSelectedNode){
	    	var selected = (edgesToSelectedNode == 0)? true:false;	    	
		    groupId = this.debateManager.nodes[id].group;	    	
		    var inactive = (groupId)?!this.debateManager.groups[groupId].open : false;

		    if(visibleNodes[id]!= undefined){
		    	if(selected)visibleNodes[id].selected=selected;
		    	visibleNodes[id].inactive=inactive;
		    	return;
		    }
		    this.nrOfNodes++;
		    visibleNodes[id] = {'id':id, 'selected':selected, 'inactive':inactive, 'edgesToSelectedNode': edgesToSelectedNode};
	    };	    
	    
	    this.addEdgeToVisibleGraph = function(edge){	    	
	    	var source = edge.source;
	    	var target = edge.target;
	    		    	
	    	if (visibleEdges[source] != undefined && visibleEdges[source][target] != undefined) return; 
	    	
	    	if(visibleEdges[source] == undefined){
	    		visibleEdges[source]={};
	    	}
	    		    	
	    	visibleEdges[source][target] = {source:source, target:target, sourceModel:edge.source, targetModel:edge.target};
	    };
	    		
		//changeGraphDepth recursively collects the nodes and edges for a given graphDepth and selectedNode.
		this.changeGraphDepth = function(currentDepth, newDepth){
			var that = this;
			if(currentDepth < newDepth) {			  
				$.each(visibleNodes,function(key, value){
					var node=value;
						if(node.edgesToSelectedNode == currentDepth){
							if(that.debateManager.getEdgesTo(node.id) !=undefined)$.each(that.debateManager.getEdgesTo(node.id),function(key, value){
									that.addNodeToVisibleGraph(value.source, currentDepth+1);
									that.addEdgeToVisibleGraph(value);
							});
							if(that.debateManager.getEdgesFrom(node.id)!= undefined)$.each(that.debateManager.getEdgesFrom(node.id),function(key, value){
									that.addNodeToVisibleGraph(value.target, currentDepth+1);
									that.addEdgeToVisibleGraph(value);
							});
							//recursion
							that.changeGraphDepth(currentDepth+1,newDepth);
						}
				});				  
			}else return;
		};
		  		
	    //Privileged Methods (public methods with access to private members)
	    this.setGraphDepth = function(depth){
	    	this.graphDepth = depth;
	    	this.update();
	    };
		this.selectNode = function(nodeId){
			if(selectedNode == nodeId) return;
			selectedNode = nodeId;
			this.update();
		};	    
		this.update = function(){
			visibleNodes = {};
			visibleEdges = {};
			this.nrOfNodes = 0;
			this.addNodeToVisibleGraph(selectedNode,0);
			this.changeGraphDepth(0, this.graphDepth);
			configurator.configurate(this.nrOfNodes);
				
			sys.merge({'nodes':visibleNodes,'edges':visibleEdges});			  
		};			    	    
	};
//public methods
	var p = ArborController.prototype; 
	    p.handleEvent = function(evt){		  
	    	if(evt.type == "historyChange"){
				var state = evt.state;
				if(state.type == "nodeSelection"){
					this.selectNode(state.data.nodeId);
				}
			}else if(evt.type == "graphDepthChange"){
				this.graphDepth = evt.value;
				this.update();
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
			}
		};
    argunet.ArborController = ArborController;
}());