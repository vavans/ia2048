var node = function(gameState) {
    this.gameState = gameState;
    this.children = new Array();
    this.simulationCount = 0;
    this.totalScore = 0;
};

node.prototype.addChild = function(child) {
    this.children.push(child);
};

node.prototype.hasChildren = function() {
    return this.children.length > 0;
};

node.prototype.AverageScore = function() {
    return this.totalScore / this.simulationCount;
}

