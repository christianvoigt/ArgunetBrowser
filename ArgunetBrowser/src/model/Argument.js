// namespace:
this.argunet = this.argunet||{};

argunet.Argument = function(argunetId, title, description, colorIndex, group,relations){
	this.id=argunetId;
	this.title=title;
	this.description=description;
	this.sentences= [];
	this.colorIndex= colorIndex;
	this.group = group;
	this.relations = relations;
};
argunet.Argument.prototype.addSentence= function(text,nr,type){
	var sentence= new Sentence(text,nr,type);
	this.sentences[nr]=sentence;
};
