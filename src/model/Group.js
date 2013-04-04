// namespace:
this.argunet = this.argunet||{};

argunet.Group = function(id, title, color, numberOfArguments,numberOfTheses){
	this.id = id;
	this.title=title;
	this.color= color;
	this.numberOfArguments = parseInt(numberOfArguments);
	this.numberOfTheses = parseInt(numberOfTheses);
	this.nodes = [];
	this.open = true;
};
argunet.Group.prototype.addNode = function(nodeId){
	this.nodes.push(nodeId);
};
