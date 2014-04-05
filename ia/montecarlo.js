function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex
    ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// node object

var node = function(gameState, parent) {
    this.gameState = gameState;
    this.parent = parent;
    this.children = new Array(null, null, null, null);
    this.lastMoves = new Array(1,2,3,4);
    this.isLeaf = true;
    this.simulationCount = 0;
    this.totalScore = 0;
};

node.prototype.averageScore = function() {
    return this.totalScore / this.simulationCount;
};

node.prototype.evaluate = function(child) {
    return child.averageScore + 1.4142135623730950488 * Math.sqrt( Math.log(this.simulationCount / child.simulationCount));
};

node.prototype.expand = function() {
    //First, we expand a move not allready explored
    if (lastMoves.length > 0) {
        var move = lastMoves.pop();            
        var child = new node(gameState.play(move), this);
        this.children.push(child);
        child.simulate();            
    }
    else {

    //If the 4 possibles moves for a position are all explored, we expand the best one 
    var bestMove = { child : null, score : 0 };
    for (int i = 0; i < this.children.length; i++) {
        var newScore = this.evaluate(this.children[i]);
        if (newScore > bestMove.score) {
            bestMove.child = this.children[i];;
            bestMove.score = newScore;
        }
    }   
    bestMove.child.expand();
};

node.prototype.backPropagation = function(simScore) {
    this.simulationCount++;
    this.totalScore += simScore;
    if (this.parent !== null) {
        this.parent.backPropagation(simScore);
    }
};

node.prototype.simulate = function() {
    var simScore = this.gameState.simulate(); 
    this.backPropagation(simScore);
};

// tree object

var tree = function(gameState) {
    this.root = new node(gameState);
    
    
};
