// namespace:
this.argunet = this.argunet||{};

(function() {
 var GroupCanvasView = function(group) {
        this.initialize(group);
    };
    //Inheritance from SelectableView
    var p = GroupCanvasView.prototype = new argunet.SelectableView(); 
    p.Selectable_initialize = GroupCanvasView.prototype.initialize;
    p.Selectable_tick = GroupCanvasView.prototype._tick; 
     
    p.initialize = function (group) {
        //call to initialize() method from parent class 
    	var members = group.numberOfArguments + group.numberOfTheses;
        this.Selectable_initialize(group.id, "Group: "+group.title, members + " Members", {base:group.color, dark:"#666", light: group.color});
        this.group=group;
        this.styleState2.textCss = "bold 18px Arial";
        this.styleState2.borderWidth=1;
        this.styleState1.borderWidth=1;
        this.styleState1.cornerRadius =20;
        this.styleState2.cornerRadius = 35;
        this.styleState0.cornerRadius =10;
        this.state0Height=25;
        this.paddingState1={top:12,left:12,bottom:12,right:12};                
        this.paddingState2={top:20,left:20,bottom:20,right:20};   
        


        this.render();
    };
<<<<<<< HEAD
=======
//    p.renderState2 = function (){
//        //State 2 (Title with Text)
//        var titleState2 = new createjs.Text(this.title, this.styleState2.titleCss,this.styleState2.titleColor);
//        titleState2.lineWidth= this.styleState2.width-this.paddingState2.left-this.paddingState2.right;
//        titleState2.textAlign ="center";
//        var max=200;
//        var shortText= (this.text.length>max)? this.text.substring(0, this.text.length - (this.text.length-max))+" ..." : this.text;
//        
//        var textState2 = new createjs.Text(shortText, this.styleState2.textCss,this.styleState2.textColor);
//        textState2.lineWidth= this.styleState2.width-this.paddingState2.left-this.paddingState2.right;
//        textState2.textAlign ="center";
//        
//        var buttonTextState2 = new createjs.Text("Open Group","12px Arial","#1c94c4");
//        buttonTextState2.textAlign = "center";
//        buttonTextState2.lineWidth = 80;
//        
//        var graphic = new createjs.Graphics();
//        graphic.beginFill("#eee");
//        graphic.setStrokeStyle(1).beginStroke("#ccc");
//        graphic.drawRoundRect(0,0,90,20,5);
//        
//        var buttonBg= new createjs.Shape(graphic);
//
//
//        this.state2Height=this.paddingState2.top+titleState2.getMeasuredHeight()+this.paddingState2.top/2
//        +textState2.getMeasuredHeight()+this.paddingState2.top/2+20+this.paddingState2.bottom;
//               
//        var graphic = new createjs.Graphics();
//        graphic.beginFill(this.styleState2.bgColor);
//        graphic.setStrokeStyle(this.styleState2.borderWidth).beginStroke(this.styleState2.borderColor);
//        graphic.drawRoundRect(0,0,this.styleState2.width,this.state2Height,this.styleState2.cornerRadius);
//        
//        var bgState2= new createjs.Shape(graphic);
//        bgState2.x=-this.styleState2.width/2;
//        bgState2.y=-this.state2Height/2;
//        
//        titleState2.x=textState2.x=bgState2.x+this.styleState2.width/2;
//        titleState2.y=bgState2.y+this.paddingState2.top;
//        textState2.y=titleState2.y+titleState2.getMeasuredHeight()+this.paddingState2.top/2;
//
//        buttonBg.x=-45;
//        buttonBg.y=textState2.y+textState2.getMeasuredHeight()+this.paddingState2.top/2;
//        buttonTextState2.x= 0;
//        buttonTextState2.y= buttonBg.y+3;
//
//        this.state2.addChild(bgState2);
//        this.state2.addChild(titleState2);
//        this.state2.addChild(textState2);
//        this.state2.addChild(buttonBg);
//        this.state2.addChild(buttonTextState2);
//        
//        this.addEventListener("mouseover",function(evt){
//        	if(evt.target === buttonBg) console.log("buttonBg mouseover");
//        	buttonTextState2.color = "#eb8f00";
//        });
//        buttonBg.addEventListener("mouseout",function(evt){
//        	console.log("buttonBg mouseout");
//        	buttonTextState2.color = "#1c94c4";
//        });
//        this.addEventListener("click",function(evt){
//        	var target = evt.target;
//        	console.log("buttonBg click");
//        	//buttonTextState2.color = "#1c94c4";
//        });
//    };
>>>>>>> refs/remotes/choose_remote_name/master
    argunet.GroupCanvasView = GroupCanvasView;
}());
