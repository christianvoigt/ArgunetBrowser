// namespace:
this.argunet = this.argunet||{};

(function() {
	
	var SelectableView = function() {
    };
    //Inheritance from Container
    var p = SelectableView.prototype = new createjs.Container(); 
    p.Container_initialize = SelectableView.prototype.initialize;
    p.Container_tick = SelectableView.prototype._tick; 
     
    p.initialize = function (nodeId,title,text,colors) {

        //call to initialize() method from parent class 
        this.Container_initialize();
        this.nodeId=nodeId;
        this.colors=colors;
        this.title=title;
        this.text=text;
        
        this.state0Height = 15;
        this.cornerRadius = 8;
        this.styleState1={width:100, bgColor:this.colors.base, borderColor: this.colors.dark, borderWidth:1, cornerRadius:8, titleColor:this.colors.dark, titleCss:"11px Arial", textColor:this.colors.dark};
        this.styleState2={width:130, bgColor:this.colors.base, borderColor: this.colors.dark, borderWidth:3, cornerRadius:8, titleColor:this.colors.dark, titleCss:"bold 11px Arial", textColor:this.colors.dark, textCss:"11px Arial"};
        this.styleState0={cornerRadius:8};
        this.paddingState1={top:4,left:4,bottom:4,right:4};                
        this.paddingState2={top:8,left:8,bottom:8,right:8};                
        this.marginState1={top:1,right:1,bottom:1,left:1};
        this.marginState2={top:2,right:2,bottom:2,left:2};
        var that = this;
        this.addEventListener("mousedown",this);
    };
    p.handleEvent = function(evt){
    	if(evt.type == "mousedown"){
    		this.lastMousedown = new Date().getTime();
    	var that = this;
        // add handlers directly to the event object:
        evt.onMouseMove = function(evt) {
            evt.target.x = evt.stageX;
            evt.target.y = evt.stageY;
            that.dispatchEvent("drag",that);
        }
        evt.onMouseUp = function(evt) { 
    		var now =new Date().getTime();
    		if(now-that.lastMousedown < 200){
    			that.dispatchEvent("select",that);
    		}
        	that.dispatchEvent("drop",that); 
        	};
    	}
    };
    p.render = function(){
        this.state0= new createjs.Container();        
        this.state0inactive= new createjs.Container();        
        this.state1= new createjs.Container();        
        this.state2= new createjs.Container();

        this.addChild(this.state0);
        this.addChild(this.state0inactive);
        this.addChild(this.state1);
        this.addChild(this.state2);
        
        //State 0 (Dot)
        var graphic = new createjs.Graphics();
        graphic.beginFill(this.styleState1.bgColor);
        graphic.setStrokeStyle(this.styleState1.borderWidth).beginStroke(this.styleState1.borderColor);
        graphic.drawRoundRect(0,0,this.state0Height,this.state0Height,this.styleState0.cornerRadius);
        var bgState0= new createjs.Shape(graphic);
        bgState0.x=-this.state0Height/2;
        bgState0.y=-this.state0Height/2;
        this.state0.addChild(bgState0);
        
        //State 0 inactive (grey dots for groups)
        var inactiveColor = "#dddddd";
        var graphic = new createjs.Graphics();
        graphic.beginFill(inactiveColor);
        graphic.setStrokeStyle(this.styleState1.borderWidth).beginStroke("#bbbbbb");
        graphic.drawRoundRect(0,0,this.state0Height,this.state0Height,this.styleState0.cornerRadius);
        var bgState0inactive= new createjs.Shape(graphic);
        bgState0inactive.x=-this.state0Height/2;
        bgState0inactive.y=-this.state0Height/2;
        this.state0inactive.addChild(bgState0inactive);
                
        
        //State 1 (Title)
        var titleState1 = new createjs.Text(this.title, this.styleState1.titleCss,this.styleState1.titleColor);
        titleState1.lineWidth= this.styleState1.width-this.paddingState1.left-this.paddingState1.right;
        titleState1.textAlign ="center";
        
        this.state1Height=titleState1.getMeasuredHeight()+this.paddingState1.top+this.paddingState1.bottom;
        
        var graphic = new createjs.Graphics();
        graphic.beginFill(this.styleState1.bgColor);
        graphic.setStrokeStyle(this.styleState1.borderWidth).beginStroke(this.styleState1.borderColor);
        graphic.drawRoundRect(0,0,this.styleState1.width,this.state1Height,this.styleState2.cornerRadius);
        var bgState1= new createjs.Shape(graphic);
        bgState1.x=-this.styleState1.width/2;
        bgState1.y=-this.state1Height/2;
        this.state1.addChild(bgState1);
             

        titleState1.x = bgState1.x+this.styleState1.width/2;
        titleState1.y = bgState1.y+this.paddingState1.top;
        this.state1.addChild(titleState1);
                       
        this.renderState2();
        
        this.deselect();    	
    };
    p.renderState2 = function(){
        //State 2 (Title with Text)
        var titleState2 = new createjs.Text(this.title, this.styleState2.titleCss,this.styleState2.titleColor);
        titleState2.lineWidth= this.styleState2.width-this.paddingState2.left-this.paddingState2.right;
        titleState2.textAlign ="center";
        var max=200;
        var shortText= (this.text.length>max)? this.text.substring(0, this.text.length - (this.text.length-max))+" ..." : this.text;
        
        var textState2 = new createjs.Text(shortText, this.styleState2.textCss,this.styleState2.textColor);
        textState2.lineWidth= this.styleState2.width-this.paddingState2.left-this.paddingState2.right;
        textState2.textAlign ="center";

        this.state2Height=this.paddingState2.top+titleState2.getMeasuredHeight()+this.paddingState2.top/2+textState2.getMeasuredHeight()+this.paddingState2.bottom;
               
        var graphic = new createjs.Graphics();
        graphic.beginFill(this.styleState2.bgColor);
        graphic.setStrokeStyle(this.styleState2.borderWidth).beginStroke(this.styleState2.borderColor);
        graphic.drawRoundRect(0,0,this.styleState2.width,this.state2Height,this.styleState2.cornerRadius);
        
        var bgState2= new createjs.Shape(graphic);
        bgState2.x=-this.styleState2.width/2;
        bgState2.y=-this.state2Height/2;
        
        titleState2.x=textState2.x=bgState2.x+this.styleState2.width/2;
        titleState2.y=bgState2.y+this.paddingState2.top;
        textState2.y=titleState2.y+titleState2.getMeasuredHeight()+this.paddingState2.top/2;
        
        this.state2.addChild(bgState2);
        this.state2.addChild(titleState2);
        this.state2.addChild(textState2);    	
        
    };
    p.getMarginedHeight = function(){
    	if(this.state1.visible){
    		return this.state1Height+this.marginState1.top+this.marginState1.bottom;
    	}else if(this.state2.visible){
    		return this.state2Height+this.marginState2.top+this.marginState2.bottom;    		
    	}else return this.state0Height;
    };
    p.getMarginedWidth = function(){
    	if(this.state1.visible){
    		return this.styleState1.width+this.marginState1.top+this.marginState1.bottom;
    	}else if(this.state2.visible){
    		return this.styleState2.width+this.marginState1.left+this.marginState1.right;    		
    	}else return this.state0Height;
    };    
    p.select = function(){
    	this.state0.visible=false;
		this.state0inactive.visible=false;
    	this.state1.visible=false;
    	this.state2.visible=true;
    };
    p.deselect = function(){
    	this.state0.visible=false;
		this.state0inactive.visible=false;
    	this.state1.visible=true;
    	this.state2.visible=false;
    };
    p.minimize = function(inactive){
    	this.state1.visible=false;
    	this.state2.visible=false;
    	if(!inactive){
    		this.state0.visible=true;
    		this.state0inactive.visible=false;
    	}else{
    		this.state0.visible=false;
    		this.state0inactive.visible=true;
    	}
    };
    p._tick = function () {
           //call to _tick method from parent class 
               //this.Container_tick();

    };
    argunet.SelectableView = SelectableView;
}());

