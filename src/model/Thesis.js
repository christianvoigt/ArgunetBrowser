// namespace:
this.argunet = this.argunet||{};

argunet.Thesis = function(props){
	this.id;
	this.argunetId;
	this.title="untitled";
	this.content="";
	this.colorIndex= "0";
	this.group;
	this.relations = {};
	$.extend(true,this,props);
};
