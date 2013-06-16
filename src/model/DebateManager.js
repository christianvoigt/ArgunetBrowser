// namespace:
this.argunet = this.argunet||{};

argunet.DebateManager = function(container) {
	this.doc= $(container).get(0).ownerDocument;

	this.nodes={};
	this.colors=[];
	this.groups={};
	this.edgesBySource={};
	this.edgesByTarget={};
	var that = this;


// mix-ins:
// EventDispatcher methods:
var p= argunet.DebateManager.prototype;

p.addEventListener = null;
p.removeEventListener = null;
p.removeAllEventListeners = null;
p.dispatchEvent = null;
p.hasEventListener = null;
p._listeners = null;
createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.

this.loadDebate = function(data){

	var suffix = ".graphml";
	if(data && data.toLowerCase().indexOf(suffix, data.length - suffix.length) !== -1){
		//graphml
		this.loadGraphml(data);
	}else{
		var el;
		if(!data){
			el = $(container, this.doc).get(0);
		}else el = $(data, this.doc).get(0);
		
		if(el && $(el).is(".argument-map")){
			//html
			this.parseHtml(el);
		}else{
			this.dispatchEvent({type:"error", textStatus:"Could not find argument map html."},this);		
		}
	}
};

this.loadGraphml = function(url){
	console.log("loading graphml");
	//Load XML File (this could cause problems with IE)
	$.ajax({
		type:'GET',
		url: url,
		dataType: "XML",
				success : function(response) 
				{
					var xml;
					if ( !window.DOMParser ) { //Internet Explorer
						xml = new ActiveXObject("Microsoft.XMLDOM");
						xml.async = false;
						xml.loadXML(response);
					} else {
						xml = response;
					}
					xml = $(response);
					that.parseGraphml(xml);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) 
				{
					this.dispatchEvent({type:"error", textStatus:textStatus, errorThrown: errorThrown},this);
				}
	});			
};

this.parseGraphml = function(xml){
		   //colorTable (Problem mit Namespace. Siehe: http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/ und http://bugs.jquery.com/ticket/10377)
 		   var debate = $(xml).find('arg\\:debate, debate').get(0);
 		   this.debateTitle = $(debate).children("arg\\:title").text();
 		   this.debateSubtitle = $(debate).children("arg\\:subtitle").text();
 		   
    		$(xml).find('arg\\:color, color').each(function(){
			   var colorIndex= $(this).attr('colorIndex');
			   var colorDescription= $(this).attr('description');
		   var baseColor=$(this).attr('colorCode');
		   that.colors[colorIndex]= that.getColorObject(colorIndex, colorDescription, baseColor);
		   //$.style.insertRule(['.color'+color.colorIndex], 'background-color:'+color.colorCode+';');
		   //$.style.insertRule(['.borderColor'+color.colorIndex], 'border-color:'+color.colorCode+'; color:'+color.colorCode+';');
			//$.style.insertRule(['.lightColor'+color.colorIndex], 'background-color:'+lightColor+';');
		   });
		   
		   //node list
		   $(xml).find('node').each(function(){
			   var node;
			   
			   if($(this).children("data").children("arg\\:group").length){ //Groups
				   var groupXML = $(this).children("data").children("arg\\:group").get(0);
				   var gTitle = $(groupXML).children("arg\\:title").text();
				   var numberOfArguments = $(groupXML).attr("numberOfArguments");
				   var numberOfTheses = $(groupXML).attr("numberOfTheses");
				   var gColor = $(groupXML).attr("color");
				   var gId = $(groupXML).attr("id");
				   node = new argunet.Group(gId, gTitle,gColor,numberOfArguments,numberOfTheses);
				   that.groups[gId] = node;
			   }else if($(this).children("data").children("arg\\:argument").length){ //Arguments
				   
				   var argumentXML= $(this).children("data").children("arg\\:argument").get(0);
				   //var nodeId=$(this).attr("id");
				   var argunetId=$(argumentXML).attr("id");
				   var title=$(argumentXML).children("arg\\:title").text();
				   var description=$(argumentXML).children("arg\\:description").text();
				   var colorIndex=$(argumentXML).attr('colorIndex');	
				   var relations = {
						   incomingAttacks : $(argumentXML).attr("incomingAttacks"),
						   incomingSupports : $(argumentXML).attr("incomingSupports"),
						   outgoingAttacks : $(argumentXML).attr("outgoingAttacks"),
						   outgoingSupports : $(argumentXML).attr("outgoingSupports")
						   };
				   var group;
				   if($(this).parents("node:first").length){
					   var gId = $(this).parents("node:first").children("data:first").children("arg\\:group").attr("id");
					   that.groups[gId].addNode(argunetId);
					   group = gId;
				   }

				   node= new argunet.Argument({id: argunetId,title:title,description:description, colorIndex:colorIndex, group:group, relations:relations});
				   that.nodes[argunetId]=node;
			   }else if($(this).children("data").children("arg\\:thesis").length){ //Theses
				   var thesisXML= $(this).children("data").children("arg\\:thesis:first").get(0);
				   //var nodeId=$(this).attr("id");
				   var argunetId=$(thesisXML).attr("id");
				   var title=$(thesisXML).children("arg\\:title").text();
				   var content=$(thesisXML).children("arg\\:content").text();
				   var colorIndex=$(thesisXML).attr('colorIndex');
				   var group;
				   var relations = {
						   incomingAttacks : $(thesisXML).attr("incomingAttacks"),
						   incomingSupports : $(thesisXML).attr("incomingSupports"),
						   outgoingAttacks : $(thesisXML).attr("outgoingAttacks"),
						   outgoingSupports : $(thesisXML).attr("outgoingSupports")
						   };
				   
				   if($(this).parents("node:first").length){
					   var gId = $(this).parents("node:first").children("data").children("arg\\:group").first().attr("id");
					   that.groups[gId].addNode(argunetId);
					   group = gId;
				   }
				   
				   					 
				   node= new argunet.Thesis({id:argunetId, title:title,content:content, colorIndex:colorIndex, group:group,relations:relations});
				   that.nodes[argunetId]= node;				   
			   }
			   
			   //y:ShapeNode
			   if($(this).children("data").children("y\\:ShapeNode").length){
				   var shapeNode = $(this).children("data").children("y\\:ShapeNode").first();
				   var geometry = shapeNode.children("y\\:Geometry").first();
				   node.x = geometry.attr("x");
				   node.y = geometry.attr("y");
				   node.width = geometry.attr("width");
				   node.height = geometry.attr("height");
			   }
			   
		   });
		   
		   //edges
		   $(xml).find('edge:parent').each(function(){ //problem: without the :parent jquery will find all <edge> and <arg:edge> elements (at least in chrome)
			   var edgeXML = $(this).children("data:first").children("arg\\:edge");
			   var edgeType= edgeXML.attr("type");
			   that.addEdge($(edgeXML).attr('sourceNodeId'), $(edgeXML).attr('targetNodeId'), edgeType, $(edgeXML).attr('sourcePropositionId'),$(edgeXML).attr('targetPropositionId'));
		   });		   
		   
			this.dispatchEvent({type:"debateLoaded"},this);
		   
    };
    
    this.addEdge = function(sourceNodeId, targetNodeId, edgeType, sourcePropositionId, targetPropositionId){
		   edge = new argunet.Edge(sourceNodeId,targetNodeId, edgeType, sourcePropositionId, targetPropositionId);
	       if(this.edgesBySource[edge.source] == undefined){
	    		this.edgesBySource[edge.source]={};
	       }
	       if(this.edgesByTarget[edge.target] == undefined){
	    		this.edgesByTarget[edge.target]={};
	       }		       
	       this.edgesBySource[edge.source][edge.target] = edge;
	       this.edgesByTarget[edge.target][edge.source] = edge;
	       return edge;
    };
    
    this.parseHtml = function(el){
    	console.log("parsing html argument map");
	   this.debateTitle = $(el).children("h3").text();
	   this.debateSubtitle = "";
	   
	   //default colors
	   var defaultColor1 = "#63aef2";
	   this.colors[0]=this.getColorObject(0, "default 1", defaultColor1);
	   var defaultColor2 = "#f2d863";
	   this.colors[1]=this.getColorObject(1, "default 2", defaultColor2);
	   

    	
    	//nodes
    	$(el).find(".argument, .thesis").each(function(){
    		var id = $(this).attr("id");
    		if(!id){
    			this.dispatchEvent("error", "Found node without id, which is a required attribute.", undefined);
    			return;
    		}
    		
    		var title = $(this).children("h4")? $(this).children("h4").filter(":first").text() : "Untitled";
    		var description = $(this).children("p")?  $(this).children("p").filter(":first").text() : "";
    		var colorIndex = that.lookupOrAddColor($(this).data("color")) || 0;
    		var group;
    		var relations = {
					   incomingAttacks : 0,
					   incomingSupports : 0,
					   outgoingAttacks : 0,
					   outgoingSupports : 0    				
    		};
    		
    		var node;
    		if($(this).is(".argument"))
    			node= new argunet.Argument({id:id,title:title,description:description, colorIndex:colorIndex, group:group, relations:relations});
    		else
    			node = new argunet.Thesis({id:id, title:title,description:description, colorIndex:colorIndex, group:group,relations:relations});
    		
			that.nodes[id]= node;				   

    	});
    	
    	//edges
    	$(el).find(".support, .attack").each(function(){
    		var fromNodeId = $(this).data("from");
    		var toNodeId = $(this).data("to");
    		var edgeType = $(this).is(".support")? "support" : "attack";
    		that.addEdge(fromNodeId, toNodeId, edgeType);
    	});
    	
		this.dispatchEvent({type:"debateLoaded"},this);

    };

    this.lookupOrAddColor = function(color){
    	var colorIndex;
    	if(!color) return colorIndex; // if color is undefined return
    	if(! (color != color)) color = color.toString();
    	if(color.indexOf("#") == -1) return this.colors[color]? color : colorIndex; //if color is a color index, look it up
    	
    	$(this.colors).each(function(){ //color is a hex value
    		if(this.baseColor == color){
    			colorIndex = this.index;
    			return false;
    		}
    	});
    	if(!colorIndex){
    		this.colors.push(this.getColorObject(this.colors.length, "", color));
    		colorIndex = this.colors.length-1;
    	}
    	return colorIndex;
    };
    this.getColorObject = function(index, description, baseColor){
		var lightColor= $.xcolor.lighten(baseColor,80,1).getHex();
		var darkColor= $.xcolor.darken(baseColor,45,3).getHex();

    	return {index:index, description:description,base:baseColor, light:lightColor, dark:darkColor};
    }
    this.getNode= function(nodeId){
    	return this.nodes[nodeId];
    };
    this.getColor= function(colorIndex){
    	return this.colors[colorIndex];
    };
    this.getEdge= function(from,to){
    	return this.edgesBySource[from][to];
    };
    this.getEdgesFrom= function(from){
    	return this.edgesBySource[from];
    };
    this.getEdgesTo= function(to){
    	return this.edgesByTarget[to];
    };
};
