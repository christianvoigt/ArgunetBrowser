// namespace:
this.argunet = this.argunet||{};

(function() {
 var ArgumentCanvasView = function(argument,colors) {
        this.initialize(argument,colors);
    };
    //Inheritance from SelectableView
    var p = ArgumentCanvasView.prototype = new argunet.SelectableView(); 
    p.Selectable_initialize = ArgumentCanvasView.prototype.initialize;
    p.Selectable_tick = ArgumentCanvasView.prototype._tick; 
     
    p.initialize = function (argument,colors) {
        //call to initialize() method from parent class 
        this.Selectable_initialize(argument.id, argument.title, argument.description, colors);
        this.argument=argument;
        this.render();
    };
    argunet.ArgumentCanvasView = ArgumentCanvasView;
}());