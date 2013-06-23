// namespace:
this.argunet = this.argunet||{};

argunet.ArgunetBrowserView = function(htmlElement, width, height, browserId){
	var that = this;
	
	this.canvasView= undefined;
	
	this.height100Percent = false;

	if(height && height == "100%"){
		height = $(htmlElement).innerHeight();
		this.height100Percent = true;
	}
	
	this.cWidth = width;
	this.cHeight = height || 385;
	this.cHeight -=2;
	
	var idString = "argunetBrowser-"+browserId;
	
	this.htmlElement = $("<div id='"+idString+"' class='argunetBrowser loading'></div>").appendTo(htmlElement).get(0);

	if(this.cWidth){
		this.cWidth-=2;
		$(this.htmlElement).width(this.cWidth);
	} else{
		//$(this.htmlElement).css("width","100%");
		this.cWidth = $(this.htmlElement).width();
	
	}
		

	//$(htmlElement).height(this.cHeight);
	//canvas
		

	this.canvas = $("<canvas></canvas>").appendTo(this.htmlElement).get(0);

	$(this.canvas).width(this.cWidth).height(this.cHeight);
	this.canvas.width = this.cWidth;
	this.canvas.height = this.cHeight;
	
	this.doc= this.canvas.ownerDocument;
	this.win= 'defaultView' in this.doc? this.doc.defaultView : this.doc.parentWindow;


	
	//createjs stage
	this.stage = new createjs.Stage(this.canvas);
	this.stage.mouseEventsEnabled = true;
	this.stage.enableMouseOver(20);
	
	//check if touch is supported and enable it
	if(createjs.Touch.isSupported())createjs.Touch.enable(this.stage);
	
	//Navigation Bar
	this.navigationBar = new argunet.NavigationBarView($(this.canvas).parent());
	this.navigationOpened = false;
	
	//Debate List
	this.debateListView = new argunet.DebateListView($(this.canvas).parent(),browserId);
	console.log("naviHeight "+this.navigationBar.height);
	//this.debateListView.setHeight($(this.canvas).parent().height()-this.navigationBar.height);

	
	//Tooltip
	var tooltipLayer= new createjs.Container();
	this.stage.addChild(tooltipLayer);
	
	this.tooltip = new argunet.TooltipCanvasView(this.canvas);
	//tooltipLayer.addChild(tooltip);
	this.stage.addChild(this.tooltip);
	
	//Extra Jquery Click Handler for Navigation Bar
	var that = this;
	$(this.canvas).parent().bind("mousedown touchstart",function(){
		that.showNavigationBar();
	});
	
	this.tooltip.addEventListener("mouseover",this);
	this.tooltip.addEventListener("mouseout",this);
	
	this.stage.addEventListener("stagemousemove",this);
	this.navigationBar.addEventListener("openDebateList",this);
	this.navigationBar.addEventListener("closeDebateList",this);
	
	this.doc.addEventListener('fullscreenchange', this);
	this.doc.addEventListener('mozfullscreenchange', this);
	this.doc.addEventListener('webkitfullscreenchange', this);
	this.win.addEventListener('resize', this, false);
	
	this.navigationBar.addEventListener("screenshot",this);

	
	this.navigationBar.addEventListener("openFullscreen",this);
	this.navigationBar.addEventListener("closeFullscreen",this);
	
	
	this.resize();
	
};

argunet.ArgunetBrowserView.prototype.showNavigationBar = function(){
	window.clearTimeout(this.navigationBarTimeout);
	if(!this.navigationOpened){
			this.navigationBar.show();
			this.navigationOpened = true;
	}
	var that = this;
	this.navigationBarTimeout = window.setTimeout( function(){
		if(that.navigationOpened && !that.debateListView.isOpen && that.stage.mouseY < that.canvas.height - that.navigationBar.height){
			that.navigationBar.hide();
			that.navigationOpened = false;
		}
		window.clearTimeout(that.navigationBarTimeout);
	}, 3500 );		
};
argunet.ArgunetBrowserView.prototype.handleEvent = function(evt){
	var that = this;
	if(evt.type == "showTooltip"){
    	this.tooltipTimeout = window.setTimeout( function(){
    		that.tooltip.setContent(evt.tooltip);
    		that.tooltip.setVisible(true);
    		that.tooltip.x = Math.min($(that.stage.canvas).outerWidth()-5-that.tooltip.getWidth(), that.stage.mouseX+5);
    		that.tooltip.y = Math.min(that.stage.canvas.height-5-that.tooltip.height, that.stage.mouseY+5);
    		that.stage.update();
    		window.clearTimeout(this.tooltipTimeout);
    	}, 1000 );
		
	}else if(evt.type == "hideTooltip" && !this.mouseOverTooltip){
			window.clearTimeout(this.tooltipTimeout);
			this.tooltip.setVisible(false);
			this.stage.update();
	}else if(evt.type == "screenshot"){
		this.takeScreenshot();
	}else if(evt.type == "mousedown"){
		if(!this.mouseOverTooltip){
			window.clearTimeout(this.tooltipTimeout);
			this.tooltip.setVisible(false);
			this.stage.update();
		}
	}else if(evt.type == "mouseover" && evt.target == this.tooltip){
		this.mouseOverTooltip = true;
	}else if(evt.type == "mouseout" && evt.target == this.tooltip){
		this.mouseOverTooltip = false;
		this.tooltip.setVisible(false);
		this.stage.update();		
	}else if(evt.type == "stagemousemove"){
		this.showNavigationBar();
	}else if (evt.type == "openDebateList"){
		this.debateListView.show();		
	}else if (evt.type == "closeDebateList"){
		this.debateListView.hide();		
		this.showNavigationBar();
	}else if (evt.type == "openFullscreen"){
    	var ab= $(this.canvas).parent().get(0);
    	var fs = ab.requestFullscreen || ab.webkitRequestFullscreen || ab.mozRequestFullScreen;
    	if(fs) fs.call(ab);		
	}else if (evt.type == "closeFullscreen"){
    	var fs = this.doc.exitFullscreen || this.doc.webkitExitFullscreen || this.doc.mozCancelFullScreen;
    	if(fs) fs.call(this.doc);
	}else if (evt.type == "resize" || evt.type == "fullscreenchange" || evt.type == "mozfullscreenchange" || evt.type == "webkitfullscreenchange" ){
		var c = this.canvas;
	    if(this.doc.mozFullScreen || this.doc.webkitIsFullScreen) {
	        var rect = c.getBoundingClientRect();
	        $(c).width(rect.width);
	        $(c).height(rect.height);
	    	this.canvas.width = rect.width;
	    	this.canvas.height = rect.height;
	    	//this.debateListView.setHeight(rect.height-this.navigationBar.height+2);
	    }else {
			if(this.oldWidth && this.oldHeight && this.oldWidth == $(this.htmlElement).innerWidth() && this.oldHeight == $(this.htmlElement).parent().innerHeight-2)return;
				this.resize();
	    }		
	}		
};
argunet.ArgunetBrowserView.prototype.resize = function(){
	this.cWidth = $(this.htmlElement).innerWidth();
	if(this.height100Percent){
		this.cHeight = $(this.htmlElement).parent().innerHeight() - 2;
	}
	
	if(this.cWidth<450)this.debateListView.setHeight(this.cHeight-100+2);
	else this.debateListView.setHeight(this.cHeight-50+2);
	
	$(this.canvas).width(this.cWidth);
	$(this.canvas).height(this.cHeight);
	this.canvas.width = this.cWidth;
	this.canvas.height = this.cHeight;
	this.oldWidth = this.canvas.width;
	this.oldHeight = this.canvas.height;	
};
argunet.ArgunetBrowserView.prototype.removeLoadingSpinner = function(){
	$(this.canvas).parent().removeClass("loading");
};
argunet.ArgunetBrowserView.prototype.takeScreenshot = function(replaceCanvas){
	var dataUrl = this.canvas.toDataURL();
	$(this.screenshot).children("img").attr("src",dataUrl);
	if(replaceCanvas){
		var w = $(this.htmlElement).css("width");
		$(this.htmlElement).hide();
		var screenshot = $("<div class='argunetBrowser screenshot'><img src='"+dataUrl+"' /></div>").insertAfter(this.htmlElement);
		$(screenshot).css("width",w);
		$(screenshot).css("height","auto");
	}else{
		$("<div class='argunet dialog screenshot' title='Screenshot of the current argument map'><img src='"+dataUrl+"' /></div>",this.doc).dialog(
				{width:"auto"}
		    ).children("img").css("max-width","100%");
		
	}
}

