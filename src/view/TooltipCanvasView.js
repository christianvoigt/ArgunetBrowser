// namespace:
this.argunet = this.argunet||{};

(function() {
	
	var TooltipCanvasView = function(canvas) {
		this.initialize(canvas);
    };
    //Inheritance from Container
    var p = TooltipCanvasView.prototype = new createjs.Container(); 
    p.Container_initialize = TooltipCanvasView.prototype.initialize;
    p.Container_tick = TooltipCanvasView.prototype._tick; 
     
    p.initialize = function (canvas) {
        this.Container_initialize();
    	$(canvas).parent().append("<div class='argunet-tooltip'>Dies ist ein Tooltip</div>");
    	this.tooltip = $(canvas).parent().children(".argunet-tooltip").get(0);
    	var domElement = new createjs.DOMElement(this.tooltip);
        //call to initialize() method from parent class 
        //this.addChild(domElement);
        this.addChild(domElement);
     	this.x=50;
    	this.y=50;  
    	//this.rotation=25;
    	this.setVisible(false);
    	
    	var that= this;
    	$(this.tooltip).mouseenter(function(obj){
    		that.dispatchEvent("mouseover",that);
    	});
    	$(this.tooltip).mouseleave(function(obj){
    		that.dispatchEvent("mouseout",that);
    	});
    };
    p.getWidth = function (){
    	return $(this.tooltip).outerWidth();
    }
    p.setContent = function(htmlElement){
    	$(this.tooltip).empty();
    	$(this.tooltip).append(htmlElement);
    	this.height = $(this.tooltip).outerHeight();
    };
    p.setVisible = function(visible){ //because .visible doesn't work for DOMElement
    	if(visible){
    		this.visible = true;
    		$(this.tooltip).show();    	
    	}else{
    		this.visible = false;
    		$(this.tooltip).hide();   	
    	}
    };
    p._tick = function () {
           //call to _tick method from parent class 
               this.Container_tick();
    };
    argunet.TooltipCanvasView = TooltipCanvasView;
}());

