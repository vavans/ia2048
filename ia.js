

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

var game = function() {
    
};

var board = function(array) {
    this.g = array;
    this.score = 0;
};

board.prototype.equals = function(other) {
    return other.scrore == this.score;
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
    return b;
};

var grid = function () {
    this.board = new board(new Array(	
	new Array(2, 2, 2, 2),
	new Array(4, 0, 4, 4),
	new Array(2, 2, 0, 8),
	new Array(4, 0, 2, 2)));
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
    for (x = 0; x < 4; x++) {	
	this.moveCol(colAccessorFactory(way)(this.board.g, x));
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

    return {
	getMove : function(board) {
	    return Math.floor(Math.random()*4) + 1;
	}
    };
})();


function dumpGrid(grid) {
    var html = '<ul style="display: inline-block">';
    html += "<li>over: " + grid.isOver()  + ". score: " + grid.board.score  + "</li>";
    for (var y = 3; y >= 0; y--) {
	html += "<li>";
	for (var x = 0; x < 4; x++) {
	    html += grid.board.g[x][y] + " ";
	}    
	html += "</li>";	
    }
    html += "</ul>";
    return html;
}

var simulator = function(ia) {
    
    while 
};

var g = new grid();
document.write("initial state <br/>");
document.write(dumpGrid(g));
document.write(" move down ");
g.play(1);
document.write(dumpGrid(g));
document.write("<br/>");

g = new grid();
document.write(dumpGrid(g));
document.write(" move left ");
g.play(2);
document.write(dumpGrid(g));
document.write("<br/>");


g = new grid();
document.write(dumpGrid(g));
document.write(" move up ");
g.play(3);
document.write(dumpGrid(g));
document.write("<br/>");


g = new grid();
document.write(dumpGrid(g));
document.write(" move right ");
g.play(4);
document.write(dumpGrid(g));
