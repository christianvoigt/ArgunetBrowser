// namespace:
this.argunet = this.argunet||{};

argunet.ErrorMessageView = function(htmlElement, width, height, title, message){
	this.canvasView= undefined;
	
	var cWidth = width || 640;
	var cHeight = height || 385;

	//canvas
	if (typeof(htmlElement)=="string") { htmlElement = $(htmlElement);}
	$(htmlElement).append("<div class='argunetBrowser loading' width='"+cWidth+"' height='"+cHeight+"'><h3>"+title+"</h3><p>"+message+"</p></div>");
};

