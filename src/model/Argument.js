// namespace:
this.argunet = this.argunet||{};

argunet.Argument = function(props){
	this.id;
	this.title="untitled";
	this.description="";
	this.sentences= [];
	this.colorIndex= "0";
	this.group;
	this.relations = {};
	this.x =0;
	this.y =0;
	this.width= 0;
	this.height = 0;
	$.extend(true,this,props);
};
argunet.Argument.prototype.addSentence= function(text,nr,type){
	var sentence= new Sentence(text,nr,type);
	this.sentences[nr]=sentence;
};
