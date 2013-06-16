//namespace:
this.argunet = this.argunet||{};

argunet.StaticGraphView= function(stage){
	// mix-ins:
	// EventDispatcher methods:
	var p= argunet.StaticGraphView.prototype;
	p.addEventListener = null;
	p.removeEventListener = null;
	p.removeAllEventListeners = null;
	p.dispatchEvent = null;
	p.hasEventListener = null;
	p._listeners = null;
	createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.
	
	this.stage = stage;
	this.stage.clear();
	
	this.container = new createjs.Container();
	this.edgeLayer= new createjs.Container();
	this.container.addChild(this.edgeLayer);
	this.nodeLayer= new createjs.Container();
	this.container.addChild(this.nodeLayer);		
	this.stage.addChild(this.container);

	this.nodeViews={};
	this.edgeViews={};
	this.selectedNode = undefined;
	

	

	this.handleEvent= function(evt){
		var doc= this.stage.canvas.ownerDocument;

		if(evt.type == "select"){
			this.dispatchEvent({type:"nodeSelection",nodeId:evt.target.nodeId},evt.target);
		}else if(evt.type == "mouseover"){
			doc.body.style.cursor='pointer';

			var tooltipText = "<h3>"+evt.target.title+"</h3><p>"+evt.target.text+"</p>";
			var model;
			if(evt.target instanceof argunet.ArgumentCanvasView || evt.target instanceof argunet.ThesisCanvasView){
				if(evt.target instanceof argunet.ArgumentCanvasView){
					model = evt.target.argument;
				}else model = evt.target.thesis;
				tooltipText+= "<table class='relations'>" +
				"<tr><td class='incoming-attacks'><span class='icon-incoming-attacks'></span><span class='label'>"+model.relations.incomingAttacks+"</span></td>" +
				"<td class='incoming-supports'><span class='icon-incoming-supports'></span><span class='label'>"+model.relations.incomingSupports+"</span></td></tr>" +
				"<tr><td class='outgoing-attacks'><span class='icon-outgoing-attacks'></span><span class='label'>"+model.relations.outgoingAttacks+"</span></td>" +
				"<td class='outgoing-supports'><span class='icon-outgoing-supports'></span><span class='label'>"+model.relations.outgoingSupports+"</span></td></tr>" +
				"</table>";

			}else if(evt.target instanceof argunet.GroupCanvasView){
				if(evt.target.state2.visible)tooltipText+="<p class='tip'>(double click group to open the group and show its members.)</p>";
			}
			this.dispatchEvent({type:"showTooltip",tooltip:tooltipText},evt.target);
		}else if(evt.type == "mouseout"){
			doc.body.style.cursor='default';
			this.dispatchEvent("hideTooltip",evt.target);
		}else if(evt.type == "mousedown"){
			this.dispatchEvent({type:"mousedown",nodeId:evt.target.nodeId},evt.target);
		}else if(evt.type == "drag"){
			doc.body.style.cursor='move';
		}else if(evt.type == "drop"){
			doc.body.style.cursor='default';
		}else if(evt.type == "dblclick"){
			this.dispatchEvent(evt,evt.target);			
		}
	};
	this.selectNode= function(nodeId){
	};

	this.redraw = function(nodes, edges, colors){
		var that = this;
		$.each(nodes, function(key, node){
			var nodeView;
			if(node instanceof argunet.Argument){
				nodeView = new argunet.ArgumentCanvasView(node, colors[node.colorIndex]);				
			}else if(node instanceof argunet.Thesis){
				nodeView = new argunet.ThesisCanvasView(node, colors[node.colorIndex]);				
			}
			that.nodeViews[key] = nodeView;
			that.nodeLayer.addChild(nodeView);
			nodeView.x = node.x;
			nodeView.y = node.y;
		});
		$.each(edges, function(key, edge){
			that.edgeViews[edge.source] = that.edgeViews[edge.source] || {};
			that.edgeViews[edge.source][edge.target] = new argunet.ArrowCanvasView(edge, edge.source, edge.target);
			that.edgeLayer.addChild(that.edgeViews[edge.source][edge.target]);

		});
		
		//set container position

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




