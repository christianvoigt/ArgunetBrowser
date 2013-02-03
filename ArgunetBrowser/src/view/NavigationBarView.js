// namespace:
this.argunet = this.argunet||{};

argunet.NavigationBarView = function(htmlElement){
	// mix-ins:
	// EventDispatcher methods:
	var p= argunet.NavigationBarView.prototype;
	p.addEventListener = null;
	p.removeEventListener = null;
	p.removeAllEventListeners = null;
	p.dispatchEvent = null;
	p.hasEventListener = null;
	p._listeners = null;
	createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.

	var openListLabel = "Open Debate List";

	htmlElement.append("<div class='navigationBar'>" +
			"<div class='buttons menuItem'>" +
			"<div class='back'>Back</div><div class='home'>Home</div><div class='forward'>Forward</div>" +
			"<div class='openList'>"+openListLabel+"</div>" +
			"</div>" +
			"<div class='graphDepth menuItem'>" +
			"<div class='label'>Graph Depth: <span class='graphDepthLabel'>1</span></div>" +
				"<div class='slider'></div>" +
			"</div>" +
			"</div>");
	this.htmlElement = $(htmlElement).children(".navigationBar").get(0);
	var that = this;
	$(this.htmlElement).find(".graphDepth .slider").slider({min:1,max:5,slide: function( event, ui ) {
		$(that.htmlElement).find(".graphDepthLabel").text(ui.value);
		that.dispatchEvent({type:"graphDepthChange", value:ui.value},that);
    }});
	$(this.htmlElement).find(".buttons").buttonset();
	openListButton = $(this.htmlElement).find(".openList");
	openListButton.button().click(function() {
		var label = $(this).button("option","label");
		if(label == openListLabel){
			   $(this).button('option', 'label', 'Close Debate List');
				that.dispatchEvent({type:"openDebateList"},that);
		}else{
			   $(this).button('option', 'label', openListLabel);			
				that.dispatchEvent({type:"closeDebateList"},that);
		}
	});
	$(this.htmlElement).find(".back").button({icons: {
        primary: "ui-icon-arrowthick-1-w"
    },
    text: false}).click(function() {
		that.dispatchEvent({type:"back"},that);
	});
	$(this.htmlElement).find(".home").button({icons: {
        primary: "ui-icon-home"
    },
    text: false}).click(function() {
		that.dispatchEvent({type:"home"},that);
	});
	$(this.htmlElement).find(".forward").button({icons: {
        primary: "ui-icon-arrowthick-1-e"
    },
    text: false}).click(function() {
		that.dispatchEvent({type:"forward"},that);
	});
	this.height = $(this.htmlElement).height();
	$(this.htmlElement).hide();
};
argunet.NavigationBarView.prototype.show = function(){
	console.log("fadeIn:");
	//$(this.htmlElement).fadeIn("fast");
	$(this.htmlElement).show("slide", { direction: "down"}, 200);
};
argunet.NavigationBarView.prototype.hide = function(){
	$(this.htmlElement).hide("slide", { direction: "down" }, 200);
};
argunet.NavigationBarView.prototype.setBackwardEnabled = function(enabled){
	$(this.htmlElement).find(".back").button({disabled:!enabled});
};
argunet.NavigationBarView.prototype.setForwardEnabled = function(enabled){
	$(this.htmlElement).find(".forward").button({disabled:!enabled});
};
argunet.NavigationBarView.prototype.setHomeEnabled = function(enabled){
	$(this.htmlElement).find(".home").button({disabled:!enabled});
};