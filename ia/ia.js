var colAccessorFactory = function(way) {
    switch (way) {
    case 1: //down
	return function(aGrid, x) {
	    var col = aGrid[x];
	    return { 
		get: function(idx) {
		    return col[idx];
		},
		set: function(idx, value) {
		    col[idx] = value;
		}
	    };
	};	
	break;
    case 2: //left
	return function(aGrid, y) {
	    return { 
		get: function(idx) {
		    return aGrid[idx][y];
		},
		set: function(idx, value) {
		    aGrid[idx][y] = value;
		}
	    };
	};	
	break;
    case 3: //up
	return function(aGrid, x) {
	    var col = aGrid[x];
	    return { 
		get: function(idx) {
		    return col[3 - idx];
		},
		set: function(idx, value) {
		    col[3 - idx] = value;
		}
	    };
	};
    
	
	break;
    case 4: //right
	return function(aGrid, y) {
	    return { 
		get: function(idx) {
		    return aGrid[3 - idx][y];
		},
		set: function(idx, value) {
		    aGrid[3 - idx][y] = value;
		}
	    };
	};
	break;
    }
}; 

var board = function(array) {
    this.g = array;
    this.score = 0;
};

board.prototype.equals = function(other) {
    if (other.score !== this.score) {
	return false;
    }
    for (var x = 0; x < 4; x++) {
	for (var y = 0; y < 4; y++) {
	    if (this.g[x][y] !== other.g[x][y]) {
		return false;
	    }
	}
    }
    return true;
};

board.prototype.clone = function() {
    var b = new board(new Array(	
	new Array(0, 0, 0, 0),
	new Array(0, 0, 0, 0),
	new Array(0, 0, 0, 0),
	new Array(0, 0, 0, 0)));
    for (var x = 0; x < 4; x++) {
	for (var y = 0; y < 4; y++) {
	    b.g[x][y] = this.g[x][y];
	}	
    }
    b.score = this.score;
    return b;
};

//60% tile 2
//40% tile 4
var tilesProba = new Array(2,2,2,2,2,2,4,4,4,4);

var grid = function () {
    this.board = new board(new Array(	
	new Array(0, 0, 0, 0),
	new Array(0, 0, 0, 0),
	new Array(0, 0, 0, 0),
	new Array(0, 0, 0, 0)));
};

grid.prototype.spawn = function() {
    for (var x = 0; x < 4; x++) {
	for (var y = 0; y < 4; y++) {	    
	    if (this.board.g[x][y] === 0) {
		this.board.g[x][y] = tilesProba[Math.floor(Math.random()*10)];	 
		return true;
	    }	    
	}    
    }
    return false;
};

grid.prototype.moveCol = function(colAccessor) {	
    var canGoDeeper = function(c, idx, value, min_y) {
	return (idx >= min_y && (c.get(idx) === 0 || (c.get(idx) === value)));  
    };
    
    var miny = 0;
    for (y = 1; y < 4; y++) {	   
	var v = colAccessor.get(y);
	if (v === 0)
	    continue;
	colAccessor.set(y,0);
	
	var ny = y - 1;
	
	var destination = y;
	
	while(canGoDeeper(colAccessor, ny, v, miny)) {
	    destination = ny;
	    if (colAccessor.get(ny) === v) {
		colAccessor.set(ny,0);
		v *= 2;
		this.board.score += v;
		miny = ny + 1;
	    }
	    ny--;
	}
	colAccessor.set(destination, v);
    }
};

grid.prototype.play = function(way) {
    var x = 0;
    var oldBoard = this.board.clone();
    for (x = 0; x < 4; x++) {	
	this.moveCol(colAccessorFactory(way)(this.board.g, x));
    }
    var newBoard = this.board;
    //spawn a tile when the move is a valid one (ie : tiles have moved)
    if (!oldBoard.equals(newBoard)) {
	this.spawn();
    }
};

grid.prototype.isOver = function() {
    var newGrid = new grid();
    newGrid.board = this.board.clone();
    for (var way = 1; way < 5; way++) {
	for (x = 0; x < 4; x++) {		    
	    newGrid.moveCol(colAccessorFactory(way)(newGrid.board.g, x));
	    if (!newGrid.board.equals(this.board)) {
		return false;
	    }
	}
    }
    return true;
};

var ia = (function () {
    var p2 = 0.6;
    var p4 = 0.4;

    var evaluateMove = function(board, move) {
	var maxDeep = 15;
	var gamesNb = 60;
	var sum = 0;
	var boardMin;
	var boardMax;
	for (var p = 0; p < gamesNb; p++) {    
	    var currentGame = new grid();
	    currentGame.board = board.clone();
	    currentGame.play(move);		
	    var i = 0;	    
	    while (!currentGame.isOver() && i < maxDeep) {
		i++;
		var m = Math.floor(Math.random()*4) + 1;
		currentGame.play(m);		
	    }			    
	    
	    var score = currentGame.board.score;
	    sum += score;
	}
	return sum / gamesNb;
    };

    return {
	getMove : function(board) {	    
	    var moves = new Array(1,2,3,4);
	    var bestMove = { score:1, way: 1};
	    for (var i = 0; i < 4; i++) {
		var s = evaluateMove(board, moves[i]);
		if (s > bestMove.score) {
		    bestMove = { score:s, way: moves[i]};
		}
	    }
	    return bestMove.way;	    
	}
    };
})();

function dumpBoard(board) {
    var html = '<ul style="display: inline-block">';
    html += "<li>score: " + board.score  + "</li>";
    for (var y = 3; y >= 0; y--) {
	html += "<li>";
	for (var x = 0; x < 4; x++) {
	    html += board.g[x][y] + " ";
	}    
	html += "</li>";	
    }
    html += "</ul>";
    return html;
}

function dumpMove(way) {
    switch (way) {
    case 1:
	document.write(" move down ");
	break;
    case 2:
	document.write(" move left ");
	break;
    case 3:
	document.write(" move up ");
	break;
    case 4:
	document.write(" move right ");
	break;
    }
}


var simulator = function(ia) {
    var currentGame = new grid();
    currentGame.spawn();
    currentGame.spawn();
    //dumpGrid(currentGame)
    var i = 0;
    while (!currentGame.isOver()) {
	var move = ia.getMove(currentGame.board);
	dumpMove(move);
	currentGame.play(move);
	document.write(dumpBoard(currentGame.board));
    }
    return currentGame;
};

var max = 0;
var gamesNb = 1;
var sum = 0;
var min = 10000000000000000;
var boardMin;
var boardMax;
for (var p = 0; p < gamesNb; p++) {    
    var game = simulator(ia);
    var score = game.board.score;
    sum += score;
    if (score > max) {
	max = score;
	boardMax = game.board.clone();
    }
    if (score < min) {
	min = score;
	boardMin = game.board.clone();
    }
}

document.write(dumpBoard(boardMax));
document.write("<br/>max score = " + max + "<br/>");
document.write(dumpBoard(boardMin));
document.write("<br/>min score = " + min + "<br/>");

document.write("average score = " + sum / gamesNb + "<br/>");
