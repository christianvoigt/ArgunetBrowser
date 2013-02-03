//namespace:
this.argunet = this.argunet||{};

argunet.ArborView= function(debateM){

	var debateManager = debateM;

	// mix-ins:
	// EventDispatcher methods:
	var p= argunet.ArborView.prototype;
	p.addEventListener = null;
	p.removeEventListener = null;
	p.removeAllEventListeners = null;
	p.dispatchEvent = null;
	p.hasEventListener = null;
	p._listeners = null;
	createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.

	var particleSystem = null;	
	this.stage; 
	var nodeViews={};
	var edgeViews={};
	var selectedNode = undefined;
	var nodeLayer = undefined;
	var edgeLayer = undefined;

	//ArgunetBrowserView calls this
	this.initialize = function(createjsStage){
		this.stage = createjsStage; 

		edgeLayer= new createjs.Container();
		this.stage.addChild(edgeLayer);
		nodeLayer= new createjs.Container();
		this.stage.addChild(nodeLayer);			
	};

	//Arbor calls this
	this.init= function(system){
		particleSystem = system;
		particleSystem.screenSize(this.stage.canvas.width, this.stage.canvas.height);
		particleSystem.screenPadding(40);
	};
	this.handleEvent= function(evt){
		if(evt.type == "select"){
			this.selectNode(evt.target.nodeId);
			this.dispatchEvent({type:"nodeSelection",nodeId:evt.target.nodeId},evt.target);
		}else if(evt.type == "mouseover"){
			var tooltipText = "<h3>"+evt.target.title+"</h3><p>"+evt.target.text+"</p>";
			if(evt.target instanceof argunet.ArgumentCanvasView){
				tooltipText+= "<table class='relations'><tr><td></td><td class='attacks'>Attacks</td><td class='supports'>Supports</td></tr>" +
				"<tr><td class='incoming'>Incoming</td><td class='attacks'>"+evt.target.argument.relations.incomingAttacks+"</td>" +
				"<td class='supports'>"+evt.target.argument.relations.incomingSupports+" </td></tr>" +
				"<tr><td class='outgoing'>Outgoing</td><td class='attacks'>"+evt.target.argument.relations.outgoingAttacks+" </td>" +
				"<td class='supports'>"+evt.target.argument.relations.outgoingSupports+" </td></tr>" +
				"</table>";
			}else if(evt.target instanceof argunet.ThesisCanvasView){
				tooltipText+= "<table class='relations'><tr><td></td><td class='attacks'>Attacks</td><td class='supports'>Supports</td></tr>" +
				"<tr><td class='incoming'>Incoming</td><td class='attacks'>"+evt.target.thesis.relations.incomingAttacks+"</td>" +
				"<td class='supports'>"+evt.target.thesis.relations.incomingSupports+" </td></tr>" +
				"<tr><td class='outgoing'>Outgoing</td><td class='attacks'>"+evt.target.thesis.relations.outgoingAttacks+" </td>" +
				"<td class='supports'>"+evt.target.thesis.relations.outgoingSupports+" </td></tr>" +
				"</table>";
			}else if(evt.target instanceof argunet.GroupCanvasView){
				if(evt.target.state2.visible)tooltipText+="<p class='tip'>(double click group to open the group and show its members.)</p>";
			}
			this.dispatchEvent({type:"showTooltip",tooltip:tooltipText},evt.target);
		}else if(evt.type == "mouseout"){
			this.dispatchEvent("hideTooltip",evt.target);
		}else if(evt.type == "mousedown"){
			this.dispatchEvent({type:"mousedown",nodeId:evt.target.nodeId},evt.target);
		}else if(evt.type == "drag"){
			var draggedNodeView = evt.target;
			var draggedNode = particleSystem.getNode(evt.target.nodeId);
			draggedNode.fixed = true;
			var p = {x:draggedNodeView.x, y:draggedNodeView.y};
			p = particleSystem.fromScreen(p);
			draggedNode.p = p;
		}else if(evt.type == "drop"){
			var draggedNodeView = evt.target;
			var draggedNode = particleSystem.getNode(evt.target.nodeId);
			draggedNode.fixed = false;
			draggedNode.tempMass = 50;
		}else if(evt.type == "dblclick"){
			this.dispatchEvent({type:"openGroup",id:evt.target.nodeId},evt.target);			
		}
	};
	this.selectNode= function(nodeId){
		if(selectedNode!=undefined)selectedNode.deselect();
		selectedNode=nodeViews[nodeId];   	 
		selectedNode.select();
	};

	this.redraw = function(){
		var that= this;
		if (!particleSystem) return;

		//delete nodeViews and arrowViews that are no longer used
		$.each(nodeViews, function(){
			var nodeId=this.nodeId;
			if(particleSystem.getNode(nodeId) == undefined){
				var nodeToDelete=nodeViews[nodeId];
				if(selectedNode!=undefined && nodeToDelete.nodeId==selectedNode.nodeId)selectedNode=undefined;
				nodeToDelete.removeEventListener(that);
				nodeLayer.removeChild(nodeToDelete);

				delete nodeViews[nodeId];
			}
		});
		//delete nodeViews and arrowViews that are no longer used
		$.each(edgeViews, function(){
			$.each(this,function(){
				if(particleSystem.getEdgesFrom(this.source)[this.target] == undefined){
					var edgeToDelete=edgeViews[this.source][this.target];
					//nodeToDelete.removeEventListener(that);
					edgeLayer.removeChild(edgeToDelete);

					delete edgeViews[this.source][this.target];
				}				
			});
		});

		// draw the nodes & save their bounds for edge drawing
		var nodeBoxes = {};
		particleSystem.eachNode(function(node, pt){
			// node: {mass:#, p:{x,y}, name:"", data:{}}
			// pt:   {x:#, y:#}  node position in screen coords

			//create new NodeViews
			var nodeView= nodeViews[node.data.id];
			if(nodeViews[node.data.id]==undefined){
				var nodeModel;
				if(node.data.group){
					nodeModel= debateManager.groups[node.data.id];					
				}else{
					nodeModel= debateManager.getNode(node.data.id);					
				}
				if(nodeModel instanceof argunet.Argument){
					nodeView= new argunet.ArgumentCanvasView(nodeModel,debateManager.getColor(nodeModel.colorIndex));
				}else if(nodeModel instanceof argunet.Thesis){
					nodeView= new argunet.ThesisCanvasView(nodeModel,debateManager.getColor(nodeModel.colorIndex));        			
				}else if(nodeModel instanceof argunet.Group){
					nodeView= new argunet.GroupCanvasView(nodeModel);
					nodeView.addEventListener("dblclick",that);
				}
				nodeView.addEventListener("select", that);
				nodeView.addEventListener("mousedown", that);
				nodeView.addEventListener("mouseover", that);
				nodeView.addEventListener("mouseout", that);
				nodeView.addEventListener("drag",that);
				nodeView.addEventListener("drop",that);
				nodeViews[node.data.id]=nodeView;
				nodeLayer.addChild(nodeView);
			}

			// determine the box size and round off the coords if we'll be 
			// drawing a text label (awful alignment jitter otherwise...)

			var nodeView=nodeViews[node.data.id];
			pt.x = Math.floor(pt.x);
			pt.y = Math.floor(pt.y);
			nodeView.x= pt.x;
			nodeView.y= pt.y;

			var nodeWidth = nodeView.getMarginedWidth();
			var nodeHeight = nodeView.getMarginedHeight();

			nodeBoxes[node.data.id]=[pt.x-nodeWidth/2,pt.y-nodeHeight/2,nodeWidth,nodeHeight];
			if(node.data.edgesToSelectedNode > 1)nodeView.minimize();
			else if(node.data.edgesToSelectedNode >0)nodeView.deselect();

			if(node.data.selected)that.selectNode(node.data.id);

		});

		// draw the edges
		particleSystem.eachEdge(function(edge, pt1, pt2){
			// edge: {source:Node, target:Node, length:#, data:{}}
			// pt1:  {x:#, y:#}  source position in screen coords
			// pt2:  {x:#, y:#}  target position in screen coords

			// find the start point
			//var tail = intersect_line_box(pt1, pt2, nodeBoxes[edge.source.name]);

			var nBox= nodeBoxes[edge.data.target];
			var from = {x:pt1.x, y:pt1.y};
			var to = intersect_line_box(from, pt2, nBox);

			var edgeView = (edgeViews[edge.data.source])?edgeViews[edge.data.source][edge.data.target] : undefined;

			if(edgeView==undefined){
				if(edgeViews[edge.data.source]==undefined)edgeViews[edge.data.source] = {};
				var edgeModel= debateManager.getEdge(edge.data.sourceModel,edge.data.targetModel);
				var edgeView= new argunet.ArrowCanvasView(edgeModel, edge.data.source, edge.data.target);
				edgeViews[edge.data.source][edge.data.target]= edgeView;
				edgeLayer.addChild(edgeView);
			}

			edgeView.render(from,to);

		});


		this.stage.update();
	};

	// helpers for figuring out where to draw arrows (thanks springy.js)
	var intersect_line_line = function(p1, p2, p3, p4){
		var denom = ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));
		if (denom === 0) return false; // lines are parallel
		var ua = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / denom;
		var ub = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / denom;

		if (ua < 0 || ua > 1 || ub < 0 || ub > 1)  return false;
		return arbor.Point(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
	};

	var intersect_line_box = function(p1, p2, boxTuple)
	{
		var p3 = {x:boxTuple[0], y:boxTuple[1]},
		w = boxTuple[2],
		h = boxTuple[3];

		var tl = {x: p3.x, y: p3.y};
		var tr = {x: p3.x + w, y: p3.y};
		var bl = {x: p3.x, y: p3.y + h};
		var br = {x: p3.x + w, y: p3.y + h};

		return intersect_line_line(p1, p2, tl, tr) ||
		intersect_line_line(p1, p2, tr, br) ||
		intersect_line_line(p1, p2, br, bl) ||
		intersect_line_line(p1, p2, bl, tl) ||
		false;
	};

};




