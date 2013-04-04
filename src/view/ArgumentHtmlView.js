// namespace:
this.argunet = this.argunet||{};

argunet.ArgumentHtmlView = function(argument, htmlElement){
	this.id=argument.id;
	this.title=argument.title;
	this.description=argument.description;
	this.sentences= [];
	this.colorClass= "color"+argument.colorIndex;
	this.lightColorClass= "lightColor"+argument.colorIndex;
	htmlElement.append("<div class='argument state2  "+this.lightColorClass+"'><div class='header "+this.colorClass+"'><h2 class='title'>"+this.title+"</h2></div><div class='content'><p class='description'>"+this.description+"</p></div></div>");
};