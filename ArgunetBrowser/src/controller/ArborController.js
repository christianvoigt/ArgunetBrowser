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
	    
	    var arborView = arborView;
	    arborView.addEventListener("mousedown",this);
	    sys.renderer = arborView;
	    
		this.graphDepth = 1;
		
	    var visibleNodes = {};
	    var visibleEdges = {};
	    var selectedNode = undefined;
	    
	    
//	    //FOR TESTING PREFERENCES
//		//preferences form
//		var gravity=(sys.parameters().gravity)?"checked":"";
//		var euler="";
//		var verlet="";
//		var that= this;
//		//var fixedString= (fixed)?"checked":"";
//
//		if(sys.parameters().integrator=="euler")euler="checked";
//		else verlet ="checked";
//		var cont=$(arborView.stage.canvas).parent();
//		var cId= cont.attr("id");
//		cont.append("<h3>Preferences</h3>").append("<label for='graphDepth'>Graph Depth: </label><input type='text' id='graphDepth' value='"+graphDepth+"' />")
//		//.append("<label for='nodeWidth'>Node Width: </label><input type='text' id='nodeWidth' value='"+renderer.selectedNodeWidth+"' />")
//		//.append("<label for='nodeHeight'>Node Height: </label><input type='text' id='nodeHeight' value='"+renderer.selectedNodeHeight+"' />")
//		.append("<label for='repulsion'>Repulsion: </label><input type='text' class='repulsion' value='"+sys.parameters().repulsion+"' />")
//		.append("<label for='stiffness'>Stiffness: </label><input type='text' class='stiffness' value='"+sys.parameters().stiffness+"' />")
//		.append("<label for='friction'>Friction: </label><input type='text' class='friction' value='"+sys.parameters().friction+"' />")
//		.append("<label for='gravity'>Gravity: </label><input type='checkbox' class='gravity' "+gravity+" />")
//		.append("<label for='integrator'>Integrator: </label> Euler: <input type='radio' name='integrator' class='euler' value='euler' "+euler+"/> Verlet: <input type='radio' name='integrator' id='verlet' value='verlet' "+verlet+"/>")
//
//		//.append("<h3>Selected Node</h3><label for='sNodeMass'>Mass of selected Node: </label><input type='text' id='sNodeMass' value='"+sNodeMass+"' />")
//		//.append("<label for='sNodeX'>Initial x position of selected Node: </label><input type='text' id='sNodeX' value='"+sNodeX+"' />")
//		//.append("<label for='sNodeY'>Initial y position of selected Node: </label><input type='text' id='sNodeY' value='"+sNodeY+"' />")
//		//.append("<label for='fixed'>Selected Node fixed: </label><input type='checkbox' id='fixed' "+fixedString+"/>")
//
//		.append("<input type='submit' value='submit'/>")
//		.wrap("<form class='preferences'></form>");
//		$(cId+' .preferences').submit(function(){
//			event.preventDefault();
//			//sNodeMass= $("#sNodeMass").val();
//			//sNodeX= $("#sNodeX").val();
//			//sNodeY= $("#sNodeY").val();
//			//fixed= $('#fixed').is(":checked");
//			//renderer.selectedNodeWidth= $("#nodeWidth").val();
//			//renderer.selectedNodeHeight= $("#nodeHeight").val();
//			graphDepth = $("#graphDepth").val();
//			sys.parameters({integrator:$(cId+' input:radio[name=integrator]:checked').val(),repulsion:$(cId+" .repulsion").val(),stiffness:$(cId+" .stiffness").val(),friction:$(cId+" #friction").val(),gravity:$(cId+" #gravity").is(cId+" :checked")});
//			sys.merge({nodes:{}, edges:{}});
//
//			that.selectNode(selectedNode, graphDepth);
//		});
//		//END PREFERENCES
	    
	    //Private Methods
	    
		this.addNodeToVisibleGraph = function(id,edgesToSelectedNode){
	    	var selected = (edgesToSelectedNode == 0)? true:false;
	    	var that = this;
	    	
	    	var group = this.debateManager.groups[id];
	    	var groupId;
	    	if(!group){
		    	groupId = this.debateManager.nodes[id].group;	    		
	    	}else{
	    		groupId = group.id;
	    	}


	    	if(group || (groupId != undefined && !this.debateManager.groups[groupId].open)){
			    	if(visibleNodes[groupId]!= undefined){
			    		visibleNodes[groupId].selected=selected;
			    		return;
			    	}
	    			visibleNodes[groupId] = {'id':groupId, group:true, 'selected':selected, 'edgesToSelectedNode':edgesToSelectedNode};
	    	}else{
		    	if(visibleNodes[id]!= undefined){
		    		visibleNodes[id].selected=selected;
		    		return;
		    	}
		    	visibleNodes[id] = {'id':id, 'selected':selected, 'edgesToSelectedNode': edgesToSelectedNode};
	    	}
	    };	    
	    
	    this.addEdgeToVisibleGraph = function(edge){
	    	var sourceGroupId = this.debateManager.nodes[edge.source].group;
	    	var targetGroupId = this.debateManager.nodes[edge.target].group;
	    	var sourceGroup = this.debateManager.groups[sourceGroupId];
	    	var targetGroup = this.debateManager.groups[targetGroupId];
	    	
	    	var source = edge.source;
	    	var target = edge.target;
	    	
	    	if(sourceGroup != undefined && !sourceGroup.open) source = sourceGroupId;
	    	if(targetGroup != undefined && !targetGroup.open) target = targetGroupId;
	    	
	    	if (visibleEdges[source] != undefined && visibleEdges[source][target] != undefined) return; 
	    	
	    	if(visibleEdges[source] == undefined){
	    		visibleEdges[source]={};
	    	}
	    	
	    	var targetDepth=0;
	    	var sourceDepth=0;

//	    	var targetNode= sys.getNode(target);	    	
//	    	if(targetNode != undefined) targetDepth= targetNode.data.edgesToSelectedNode;
//	    	
//	    	var sourceNode= sys.getNode(source);
//	    	if(sourceNode != undefined) sourceDepth= sourceNode.data.edgesToSelectedNode;
	    	
	    	//if(targetDepth>1 || sourceDepth>1){edge.length = 0;}
	    	
	    	visibleEdges[source][target] = {source:source, target:target, sourceModel:edge.source, targetModel:edge.target};
	    };
	    		
		//changeGraphDepth recursively collects the nodes and edges for a given graphDepth and selectedNode.
		this.changeGraphDepth = function(currentDepth, newDepth){
			var that = this;
			if(currentDepth < newDepth) {			  
				$.each(visibleNodes,function(key, value){
					var node=value;
					if(node.group){
						if(node.edgesToSelectedNode == currentDepth){
							var group = that.debateManager.groups[node.id];
							var groupMembers = group.nodes;
							$.each(groupMembers,function(index,value){
								var node = value;
								if(that.debateManager.getEdgesTo(node) !=undefined){
									$.each(that.debateManager.getEdgesTo(node),function(key, value){
										that.addNodeToVisibleGraph(value.source, currentDepth+1);
										that.addEdgeToVisibleGraph(value);
									});
								}
								if(that.debateManager.getEdgesFrom(node)!= undefined){
									$.each(that.debateManager.getEdgesFrom(node),function(key, value){								
										that.addNodeToVisibleGraph(value.target, currentDepth+1);
										that.addEdgeToVisibleGraph(value);
									});
								}								
							});
							if(group.open && selectedNode == group.id){
								selectedNode = undefined;
								delete visibleNodes[group.id];
							}
							//recursion
							that.changeGraphDepth(currentDepth+1,newDepth);

						}
					}else{
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
			
			this.addNodeToVisibleGraph(selectedNode,0);
			this.changeGraphDepth(0, this.graphDepth);

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