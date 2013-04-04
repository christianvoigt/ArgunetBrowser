// namespace:
this.argunet = this.argunet||{};

argunet.Sentence = function(text,nr,type){
	if(type!="conclusion")type="premise";
	this.text= text;
	this.nr=nr;
	this.type=type;
};