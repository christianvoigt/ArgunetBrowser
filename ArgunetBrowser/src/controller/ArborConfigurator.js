// namespace:
this.argunet = this.argunet||{};

(function() {	
	var ArborConfigurator = function(arborParticleSystem,width,height) {
		var sys = arborParticleSystem;
		this.configurate = function(nrOfNodes, graphDepth){
			//Repulsion
			//var r = 800/nrOfNodes;
			var r = 400;
			//Stiffness: the attraction between connected nodes. It acts like a spring. A higher stiffness means a stronger spring.
			//var s = 250 + 20 * nrOfNodes;
			var s = 400;
			//Friction
			var f = 0.7;
			
			console.log("repulsion: "+r + " stiffness: " + s + " friction: " + f);
			sys.parameters({repulsion:r, stiffness: s, friction: f, gravity:true});
		};
	};
    argunet.ArborConfigurator = ArborConfigurator;
}());

