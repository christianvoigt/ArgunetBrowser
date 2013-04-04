// namespace:
this.argunet = this.argunet||{};

(function() {	
	var ArborConfigurator = function(arborParticleSystem) {
		var sys = arborParticleSystem;
		this.configurate = function(nrOfNodes, graphDepth, width, height){
			//Repulsion
			//var r = 800/nrOfNodes;
			var r = 400;
			//Stiffness: the attraction between connected nodes. It acts like a spring. A higher stiffness means a stronger spring.
			//var s = 250 + 20 * nrOfNodes;
			var s = 400;
			//Friction
			var f = 0.7;
			
			//normal width is 640, fullscreen width is around 1400
			var sizeFactor = Math.max(0,width-640) / (1440-640);
			
			//the bigger the screen, the smaller repulsion
			//r = r*(1-(sizeFactor*0.7));
			//the bigger the screen, the bigger repulsion
			//r = r*(1+(sizeFactor*2));
						
			//the bigger the screen, the smaller stiffness
			//s = s*(1-(sizeFactor*0.3));
			//the bigger the screen the bigger the stiffness
			//s = Math.min(600,s*(1+(sizeFactor*0.5)));
			
			//the bigger graphdepth the smaller repulsion
			//r = r*(1/graphDepth);
			//the bigger graphdepth the higher stiffness
			//s = Math.min(800,s*(graphDepth));
			
			console.log("repulsion: "+r + " stiffness: " + s + " friction: " + f );
			sys.parameters({repulsion:r, stiffness: s, friction: f, gravity:true});
			sys.screenSize(width, height);
		};
	};
    argunet.ArborConfigurator = ArborConfigurator;
}());

