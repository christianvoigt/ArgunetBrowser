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
	
	//Fullscreen Test
	this.fullscreenApiImplemented = false;
	var fsRequest = typeof htmlElement.get(0).requestFullscreen == 'function' || typeof htmlElement.get(0).webkitRequestFullscreen == 'function' || typeof htmlElement.get(0).mozRequestFullScreen  == 'function';
	var fsExit = typeof document.exitFullscreen == 'function' || typeof document.webkitExitFullscreen == 'function' || typeof document.mozCancelFullScreen == 'function';
	var fsStatus = document.fullScreen != undefined || document.webkitIsFullScreen != undefined || document.mozFullScreen != undefined;
	if(fsRequest && fsExit && fsStatus) this.fullscreenApiImplemented = true;
	
	var fullscreenHtml = "";
	if(this.fullscreenApiImplemented) fullscreenHtml = "<div class='fullscreen menuItem'>Fullscreen</div>";

	$(htmlElement).append("<div class='navigationBar'>" +
			"<div class='menu'>" +
			"<div class='back menuItem'>Back</div><div class='home menuItem'>Home</div><div class='forward menuItem'>Forward</div>" +
			"<div class='openList menuItem'>"+openListLabel+"</div>" +
			"<div class='decreaseDepth menuItem'>Decrease Depth</div>" +
			"<div class='graphDepth menuItem'>" +
			"<div class='label'>Graph Depth: <span class='graphDepthLabel'>1</span></div>" +
				"<div class='slider'></div>" +
			"</div>" +
			"<div class='increaseDepth menuItem'>Increase Depth</div>" +
			fullscreenHtml +
			"</div>" +
			"<a href='http://www.argunet.org' class='logo'><span>Argunet</span></a>" +
			"</div>");
	this.htmlElement = $(htmlElement).children(".navigationBar").get(0);
	
	this.doc= this.htmlElement.ownerDocument;
	this.win= 'defaultView' in this.doc? this.doc.defaultView : this.doc.parentWindow;
	
	var that = this;
	var slider = $(this.htmlElement).find(".graphDepth .slider");

	
	$(slider).slider({min:1,max:5,change: function( event, ui ) {
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
        primary: "ui-icon-circle-triangle-w"
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
        primary: "ui-icon-circle-triangle-e"
    },
    text: false}).click(function() {
		that.dispatchEvent({type:"forward"},that);
	});
	$(this.htmlElement).find(".decreaseDepth").button({icons: {
        primary: "ui-icon-circle-minus"
    },
    text: false}).click(function() {
		slider.slider("value",slider.slider("value")-1);
	});	
	$(this.htmlElement).find(".increaseDepth").button({icons: {
        primary: "ui-icon-circle-plus"
    },
    text: false}).click(function() {
		slider.slider("value",slider.slider("value")+1);
	});		
	
	if(this.fullscreenApiImplemented){
		this.fullscreenLabel = "Fullscreen";
		this.exitFullscreenLabel = "Exit Fullscreen";
		this.fullscreenButton = $(this.htmlElement).find(".fullscreen");
		this.fullscreenButton.button({icons: {
	        primary: "ui-icon-open-fullscreen"
	    },
	    text: false}).click(function() {
			var label = $(this).button("option","label");
			if(label == that.fullscreenLabel){
				that.dispatchEvent({type:"openFullscreen"},that);
			}else{
				that.dispatchEvent({type:"closeFullscreen"},that);			   
			}
		});	
	}
	this.height = $(this.htmlElement).height();

	
	//Listen to Fullscreen events, because the user could exit fullscreen without pushing the fullscreen button
	this.doc.addEventListener('fullscreenchange', this);
	this.doc.addEventListener('mozfullscreenchange', this);
	this.doc.addEventListener('webkitfullscreenchange', this);
	this.win.addEventListener('resize', this, false);

	this.updateHeight();
	$(this.htmlElement,this.doc).hide();
};
argunet.NavigationBarView.prototype.handleEvent = function(evt){
	if (evt.type == "fullscreenchange" || evt.type == "mozfullscreenchange" || evt.type == "webkitfullscreenchange" ){
		if(this.doc.fullScreen || this.doc.webkitIsFullScreen || this.doc.mozFullScreen){
			this.fullscreenButton.button("option", "label", this.exitFullscreenLabel);
			this.fullscreenButton.button("option","icons",{primary:"ui-icon-exit-fullscreen"});
		}else{
			this.fullscreenButton.button("option", "label", this.fullscreenLabel);			
			this.fullscreenButton.button("option","icons",{primary:"ui-icon-open-fullscreen"});
		}
	}else if(evt.type == "resize"){
		this.updateHeight();
	}else if(evt.type == "graphDepthChange"){
		$(this.htmlElement).find(".graphDepthLabel").text(evt.value);
		var slider = $(this.htmlElement).find(".slider");
		if($(slider).slider("value") != evt.value)$(slider).slider("value",evt.value);
	}
};
argunet.NavigationBarView.prototype.updateHeight = function (){
	var w = $(this.htmlElement).width();
	if(w>580){
		$(this.htmlElement).children(".logo").show();		
	}else if(w<580 && w>450){
		$(this.htmlElement).css("height","50px");		
		$(this.htmlElement).children(".logo").hide();
	}else{
		$(this.htmlElement).children(".logo").hide();
		$(this.htmlElement).css("height","100px");
	}
};
argunet.NavigationBarView.prototype.show = function(){
	//$(".navigationBar",this.doc).show(600);
	$(this.htmlElement).show("slide", { direction: "down"}, 600);
};
argunet.NavigationBarView.prototype.hide = function(){
	//$(".navigationBar",this.doc).hide(600);
	$(this.htmlElement).hide("slide", { direction: "down" }, 600);
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
