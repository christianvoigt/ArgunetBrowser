// namespace:
this.argunet = this.argunet||{};

argunet.ThesisHtmlView = function(thesis, htmlElement){
	this.id=thesis.id;
	this.title=thesis.title;
	this.content=thesis.content;
	this.colorClass= "borderColor"+thesis.colorIndex;
	htmlElement.append("<div class='thesis content "+this.colorClass+"'><div class='header "+this.colorClass+"'><h2 class='title'>"+this.title+"</h2></div><p class='content'>"+this.content+"</p></div>");
};