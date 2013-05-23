// namespace:
this.argunet = this.argunet||{};

argunet.Edge = function(sourceId,targetId,type,sourcePropositionId,targetPropositionId){
	this.source=sourceId;
	this.target=targetId;
	this.sourceProposition=sourcePropositionId;	
	this.targetProposition=targetPropositionId;
	this.type=type;
};
