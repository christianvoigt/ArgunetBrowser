// namespace:
this.argunet = this.argunet||{};

argunet.ErrorMessageView = function(htmlElement, width, height, title, message){
	this.canvasView= undefined;
	
	var cWidth = width || 640;
	var cHeight = height || 385;

	//canvas
	if (typeof(htmlElement)=="string") { htmlElement = $(htmlElement);}
	if(!$(htmlElement).children(".argunetBrowser").length)$(htmlElement).append("<div class='argunetBrowser'></div>");
	$(htmlElement).children(".argunetBrowser:first").width(cWidth).height(cHeight).empty().addClass("error").append("<div class='error'><a href='http://www.argunet.org' class='logo'><span>Argunet Browser</span></a><h3>"+title+"</h3><p>"+message+"</p><p><a href='http://www.argunet.org'>www.argunet.org</a></p></div>");
};

