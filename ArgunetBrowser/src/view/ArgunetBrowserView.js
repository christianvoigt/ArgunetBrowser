// namespace:
this.argunet = this.argunet||{};

argunet.ArgunetBrowserView = function(htmlElement, width, height, browserId){
	this.canvasView= undefined;
	
	var cWidth = width || 640;
	var cHeight = height || 385;

	//canvas
	if (typeof(htmlElement)=="string") { htmlElement = $(htmlElement);}
	$(htmlElement).append("<div class='argunetBrowser loading' width='"+cWidth+"' height='"+cHeight+"'><canvas width='"+cWidth+"' height='"+cHeight+"'></canvas></div>");
	this.canvas = $(htmlElement).children(".argunetBrowser").children("canvas").get(0);
	
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
	this.debateListView.setHeight($(this.canvas).parent().height()-this.navigationBar.height);

	
	//Tooltip
	var tooltipLayer= new createjs.Container();
	this.stage.addChild(tooltipLayer);
	
	this.tooltip = new argunet.TooltipCanvasView(this.canvas);
	//tooltipLayer.addChild(tooltip);
	this.stage.addChild(this.tooltip);
	
	//Extra Jquery Click Handler for Navigation Bar
	var that = this;
	$(this.canvas).click(function(){
		that.showNavigationBar();
	});

};
argunet.ArgunetBrowserView.prototype.showNavigationBar = function(){
	window.clearTimeout(this.navigationBarTimeout);
	if(!this.navigationOpened){
			this.navigationBar.show();
			this.navigationOpened = true;
	}
	var that = this;
	this.navigationBarTimeout = window.setTimeout( function(){
		if(that.navigationOpened && !that.debateListView.isOpen){
			that.navigationBar.hide();
			that.navigationOpened = false;
		}
		window.clearTimeout(that.navigationBarTimeout);
	}, 2500 );		
};
argunet.ArgunetBrowserView.prototype.handleEvent = function(evt){
	var that = this;
	if(evt.type == "showTooltip" && !this.navigationOpened){
    	this.tooltipTimeout = window.setTimeout( function(){
    		that.tooltip.setVisible(true);
    		that.tooltip.x = that.stage.mouseX+5;
    		that.tooltip.y = that.stage.mouseY+5;
    		that.tooltip.setContent(evt.tooltip);
    		that.stage.update();
    		window.clearTimeout(this.tooltipTimeout);
    	}, 1000 );
		
	}else if(evt.type == "hideTooltip" && !this.mouseOverTooltip){
			window.clearTimeout(this.tooltipTimeout);
			this.tooltip.setVisible(false);
			this.stage.update();
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
	}
};
argunet.ArgunetBrowserView.prototype.setCanvasView = function (view){
	var that = this;
	this.stage.clear();
	this.canvasView = view;	
	this.canvasView.initialize(this.stage);
	this.tooltip.addEventListener("mouseover",this);
	this.tooltip.addEventListener("mouseout",this);
	
	this.stage.addEventListener("stagemousemove",this);
	this.navigationBar.addEventListener("openDebateList",this);
	this.navigationBar.addEventListener("closeDebateList",this);	
};
argunet.ArgunetBrowserView.prototype.removeLoadingSpinner = function(){
	$(this.canvas).parent().removeClass("loading");
};
