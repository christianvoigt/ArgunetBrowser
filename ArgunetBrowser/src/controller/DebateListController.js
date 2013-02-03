// namespace:
this.argunet = this.argunet||{};

(function() {
	
	var DebateListController = function(debateListView,debateManager) {
		this.view= debateListView;
		this.manager = debateManager;
		var that= this;
		var nodesInGroups={};
		var zNodes = [];
		var addNode = function(nodeId, group){
			var node = that.manager.getNode(nodeId);
			var title = "";
			if(node instanceof argunet.Argument) title = "Argument: "+node.title;
			else if (node instanceof argunet.Thesis) title = "Thesis: "+node.title;
			var zNode = {name:title, nodeId:node.id, nocheck:true};
			if(group != undefined){
				group.children.push(zNode);
				nodesInGroups[nodeId]=true;				
			}else{
				zNodes.push(zNode);
			}
		};
		$.each(this.manager.groups, function(){
			var group = {id:this.id ,name:"Hide in Group: "+this.title, children: [], checked:false};
			$.each(this.nodes,function(){
				addNode(this, group);
			});
			zNodes.push(group);
		});
		$.each(this.manager.nodes,function(){
			if(!nodesInGroups[this.id]) addNode(this.id);
		});
		
		this.view.initialize(this.manager.debateTitle,this.manager.debateSubtitle, zNodes);
	};


    argunet.DebateListController = DebateListController;
}());

