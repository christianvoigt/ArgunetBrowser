// namespace:
this.argunet = this.argunet||{};

//The History can't be a Singleton, because there could be several instances of ArgunetBrowser with their own histories.
argunet.History = function(){

	// mix-ins:
	// EventDispatcher methods:
	var p= argunet.History.prototype;
	p.addEventListener = null;
	p.removeEventListener = null;
	p.removeAllEventListeners = null;
	p.dispatchEvent = null;
	p.hasEventListener = null;
	p._listeners = null;
	createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.
	
    var pointer = -1;
    var steps = [];
    this.backwardEnabled = false;
    this.forwardEnabled = false;
    this.homeEnabled = false;
    
    this.addState = function (state){
    	if(!state instanceof argunet.HistoryState){
    		throw new Error("'state' is not an instance of argunet.HistoryState");
    		return;
    	}
    	pointer++;
    	if(pointer < steps.length-1) {
    		steps.splice(pointer, steps.length-pointer-1, state);
    		this.forwardEnabled = false;
    	}else steps[pointer] = state;
    	if(steps.length > 1) this.backwardEnabled = true;
    	if(pointer == 0)this.homeEnabled = false;
    	else this.homeEnabled = true;

    	
    	this.dispatchEvent({type:"historyChange",state:this.getCurrentState()}, this);
    };
    this.back = function(){
    	if(!this.backwardEnabled)return;
    	if(pointer > 0){
    		pointer--;
    		this.forwardEnabled = true;
    	}
    	if(pointer == 0){
    		this.backwardEnabled = false;
        	this.homeEnabled = false;
    	}else this.homeEnabled = true;

    	this.dispatchEvent({type:"historyChange",state:this.getCurrentState()}, this);
    };
    this.forward = function(){
    	if(!this.forwardEnabled)return;
    	if(pointer < steps.length-1){
    		pointer++;
    		this.backwardEnabled = true;
    		this.homeEnabled = true;
    	}
    	if(pointer == steps.length-1)this.forwardEnabled = false;
    	this.dispatchEvent({type:"historyChange",state:this.getCurrentState()}, this);
    };   
    this.home = function(){
    	if(!this.homeEnabled)return;
    	pointer = 0;
    	this.backwardEnabled = false;
    	this.homeEnabled = false;

    	if(steps.length > 0)this.forwardEnabled = true;
    	this.dispatchEvent({type:"historyChange",state:this.getCurrentState()}, this);
    };
    this.getCurrentState = function(){
    	return steps[pointer];
    };
    //Helper functions
    this.selectNode = function(nodeId){
    	if(this.selectedNode != undefined && this.selectedNode == nodeId)return;
    	this.selectedNode = nodeId;
    	this.addState(new argunet.HistoryState("nodeSelection", {nodeId:nodeId}));    	
    };
    this.handleEvent = function(evt){
    	if(evt.type == "back"){
    		this.back();
    	}else if(evt.type == "home"){
    		this.home();
    	}else if(evt.type == "forward"){
    		this.forward();
    	}    		
    };
};