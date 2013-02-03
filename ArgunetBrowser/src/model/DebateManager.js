// namespace:
this.argunet = this.argunet||{};

(function(){
	
var DebateManager = function() {
    	this.nodes={};
    	this.colors=[];
    	this.groups={};
    	this.edgesBySource={};
    	this.edgesByTarget={};
};
var p=DebateManager.prototype;
p.loadDebate= function(xml){
    		var that= this;
		   //colorTable (Problem mit Namespace. Siehe: http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/ und http://bugs.jquery.com/ticket/10377)
 		   var debate = $(xml).find('arg\\:debate, debate').get(0);
 		   this.debateTitle = $(debate).children("arg\\:title").text();
 		   this.debateSubtitle = $(debate).children("arg\\:subtitle").text();
 		   
    		$(xml).find('arg\\:color, color').each(function(){
			   var colorIndex= $(this).attr('colorIndex');
			   var colorDescription= $(this).attr('description');
		   var baseColor=$(this).attr('colorCode');
		   var lightColor= $.xcolor.lighten(baseColor,80,1).getHex();
		   var darkColor= $.xcolor.darken(baseColor,80,2).getHex();
		   that.colors[colorIndex]={index:colorIndex, description:colorDescription,base:baseColor, light:lightColor, dark:darkColor};
		   //$.style.insertRule(['.color'+color.colorIndex], 'background-color:'+color.colorCode+';');
		   //$.style.insertRule(['.borderColor'+color.colorIndex], 'border-color:'+color.colorCode+'; color:'+color.colorCode+';');
			//$.style.insertRule(['.lightColor'+color.colorIndex], 'background-color:'+lightColor+';');
		   });
		   
		   //node list
		   $(xml).find('node').each(function(){
			   
			   if($(this).children("data:first").children("arg\\:group").length){ //groups
				   var groupXML = $(this).children("data:first").children("arg\\:group");
				   var gTitle = $(groupXML).children("arg\\:title").text();
				   var numberOfArguments = $(groupXML).attr("numberOfArguments");
				   var numberOfTheses = $(groupXML).attr("numberOfTheses");
				   var gColor = $(groupXML).attr("color");
				   var gId = $(groupXML).attr("id");
				   var group = new argunet.Group(gId, gTitle,gColor,numberOfArguments,numberOfTheses);
				   that.groups[gId] = group;
			   //var group = new Group(gTitle);
			   }else if($(this).children("data:first").children("arg\\:argument").length){ //Arguments
				   
				   var argumentXML= $(this).children("data:first").children("arg\\:argument:first");
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

				   var argument= new argunet.Argument(argunetId,title,description, colorIndex, group, relations);
				   
				   

				   //console.log("Argument: "+nodeId+" "+title+" "+description+" "+colorIndex);
				   
				   that.nodes[argunetId]=argument;
			   }else if($(this).children("data:first").children("arg\\:thesis").length){ //Theses
				   var thesisXML= $(this).children("data:first").children("arg\\:thesis:first");
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
					   var gId = $(this).parents("node:first").children("data:first").children("arg\\:group").attr("id");
					   that.groups[gId].addNode(argunetId);
					   group = gId;
				   }
				   
				   					 
				   var thesis= new argunet.Thesis(argunetId, title,content, colorIndex, group,relations);
				   that.nodes[argunetId]= thesis;				   
			   }
		   });
		   
		   //edges
		   $(xml).find('edge:parent').each(function(){ //problem: without the :parent jquery will find all <edge> and <arg:edge> elements (at least in chrome)
			   var edgeXML = $(this).children("data:first").children("arg\\:edge");
			   var edgeType= edgeXML.attr("type");
			   edge = new argunet.Edge($(edgeXML).attr('sourceNodeId'),$(edgeXML).attr('targetNodeId'), edgeType,"#00CC00",$(edgeXML).attr('sourcePropositionId'),$(edgeXML).attr('targetPropositionId'));
		       if(that.edgesBySource[edge.source] == undefined){
		    		that.edgesBySource[edge.source]={};
		       }
		       if(that.edgesByTarget[edge.target] == undefined){
		    		that.edgesByTarget[edge.target]={};
		       }		       
		       that.edgesBySource[edge.source][edge.target] = edge;
		       that.edgesByTarget[edge.target][edge.source] = edge;
		   });		   
		   
    };
    p.getNode= function(nodeId){
    	return this.nodes[nodeId];
    };
    p.getColor= function(colorIndex){
    	return this.colors[colorIndex];
    };
    p.getEdge= function(from,to){
    	return this.edgesBySource[from][to];
    };
    p.getEdgesFrom= function(from){
    	return this.edgesBySource[from];
    };
    p.getEdgesTo= function(to){
    	return this.edgesByTarget[to];
    };
    argunet.DebateManager = DebateManager;
}());