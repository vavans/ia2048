// node object

var node = function (gameState, way, pparent) {
    this.gameState = gameState;
    this.pparent = pparent;
    this.way = way;
    this.children = new Array(null, null, null, null);
    this.lastMoves = new Array(1,2,3,4);
    this.isLeaf = true;
    this.simulationCount = 0;
    this.totalScore = 0;
};

node.prototype.averageScore = function () {
    return this.totalScore / this.simulationCount;
};

node.prototype.evaluate = function (child) {
    return child.totalScore * (1.0 / child.simulationCount + 1.4142135623730950488 * Math.sqrt( Math.log(this.simulationCount / child.simulationCount)));
};

node.prototype.getBestMove = function () {
    var bestMove = { child : null, score : 0 };
    for (var i = 0; i < this.children.length; i++) {
        var newScore = this.children[i].totalScore;
        if (newScore > bestMove.score) {
            bestMove.child = this.children[i];;
            bestMove.score = newScore;
        }
    }   
    return bestMove;
};

node.prototype.expand = function () {
    //First, we expand a move not allready explored
    if (this.lastMoves.length > 0) {
        var move = this.lastMoves.pop();            
        var child = new node(this.gameState.play(move), move, this);
        this.children.push(child);
        child.simulate();            
    }
    else {

    //If the 4 possibles moves for a position are all explored, we expand the best one 
    var bestMove = { child : null, score : 0 };
    for (var i = 0; i < this.children.length; i++) {
        var newScore = this.evaluate(this.children[i]);
        if (newScore > bestMove.score) {
            bestMove.child = this.children[i];;
            bestMove.score = newScore;
        }
    }   
    bestMove.child.expand();
    }
};

node.prototype.backPropagation = function (simScore) {
    this.simulationCount++;
    this.totalScore += simScore;
    if (this.pparent !== null) {
        this.pparent.backPropagation(simScore);
    }
};

node.prototype.simulate = function () {
    var simScore = this.gameState.simulate(); 
    this.backPropagation(simScore);
};

