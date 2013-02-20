// namespace:
this.argunet = this.argunet||{};

(function(){
	
	var ArrowCanvasView = function(edge, source, target) {
	        this.initialize(edge,source,target);
	};

	//Inheritance from Container
    ArrowCanvasView.prototype = new createjs.Container(); 
    ArrowCanvasView.prototype.Container_initialize = ArrowCanvasView.prototype.initialize;
    ArrowCanvasView.prototype.Container_tick = ArrowCanvasView.prototype._tick; 
     
    ArrowCanvasView.prototype.initialize = function (edge, source, target) {
        //call to initialize() method from parent class 
        this.Container_initialize();
        this.color=(edge.type==undefined || edge.type.toLowerCase()=="attack" || edge.type.toLowerCase()=="sketchedattack")? "#FF3333" : "#33FF33";
        this.edge=edge;   
        this.source = source;
        this.target = target;
    };
    
    ArrowCanvasView.prototype.render = function (from,to) {
    	this.removeAllChildren();
        var arrowLength = 18;
        var arrowWidth = 5;
        var bend=5;
        var lineThickness=1;
        var radians= Math.atan2(to.y - from.y, to.x - from.x);
        var degrees = radians * (180 / Math.PI);
    	
    	
    	
    	var a=to.x-from.x;
    	var b=to.y-from.y;
    	
    	
    	//get current line length
    	var c = Math.sqrt(a*a + b*b);
    	//shorten
    	c= c-arrowLength+bend;
    	
    	//get new coordinates    	
    	var newX= c*Math.cos(radians);
    	var newY= c*Math.sin(radians);
    	
    	newX+=from.x;
    	newY+=from.y;
    	
    	//var to2={x:a+from.x,y:b+from.y};
        var g= new createjs.Graphics();
    	g.setStrokeStyle(lineThickness).beginStroke(this.color).moveTo(from.x, from.y).lineTo(newX,newY).endStroke();
    	
    	
    	
    	var arrowLine=new createjs.Shape(g);
    	this.addChild(arrowLine);
    	
    	//Arrow Head
            // move to the head position of the edge we just drew
    	var g2= new createjs.Graphics();
        // draw the chevron
        g2.beginFill(this.color)
        	.moveTo(-arrowLength, arrowWidth)
        	.lineTo(0, 0)
        	.lineTo(-arrowLength, -arrowWidth)
        	.lineTo(-arrowLength+bend, -0)
        	.closePath()
        	.endFill();

        var arrowHead= new createjs.Shape(g2);    
        arrowHead.x=to.x;
        arrowHead.y=to.y;
        arrowHead.rotation=degrees;

            // delete some of the edge that's already there (so the point isn't hidden)
            //arrowHead.clearRect(-arrowLength/2,-wt/2, arrowLength/2,wt);
            this.addChild(arrowHead);

    };    
    ArrowCanvasView.prototype._tick = function () {
           //call to _tick method from parent class 
               //this.Container_tick();
	
    };
    argunet.ArrowCanvasView = ArrowCanvasView;
}());
