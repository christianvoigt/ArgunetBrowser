// namespace:
this.argunet = this.argunet||{};

(function() {
	var ThesisCanvasView= function(thesis,colors) {
        this.initialize(thesis,colors);
    };
    //Inheritance from Container
    var p = ThesisCanvasView.prototype = new argunet.SelectableView(); 
    p.Selectable_initialize = ThesisCanvasView.prototype.initialize;
    p.Selectable_tick = ThesisCanvasView.prototype._tick; 
     
    p.initialize = function (thesis,colors) {
        //call to initialize() method from parent class 
        this.Selectable_initialize(thesis.id, thesis.title, thesis.content, colors);
        this.thesis=thesis;
        this.styleState1.borderColor=this.styleState2.borderColor=this.colors.base;
        this.styleState1.borderWidth=2;
        this.styleState2.borderWidth=4;
        this.styleState1.bgColor=this.styleState2.bgColor="#ffffff";
        this.styleState1.textColor=this.styleState2.textColor=this.styleState1.titleColor=this.styleState2.titleColor="#000000";
        this.marginState1.top = this.marginState1.right = this.marginState1.bottom = this.marginState1.left = 1;
        this.marginState2.top = this.marginState2.right = this.marginState2.bottom = this.marginState2.left = 2;
        this.render();
    };
    argunet.ThesisCanvasView = ThesisCanvasView;
}());