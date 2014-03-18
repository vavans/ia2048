var grid = function () {
    this.g = new Array(
		       
		       new Array(2, 2, 2, 2),new Array(4, 0, 4, 4),new Array(0, 0, 4, 4),
		       new Array(4, 0, 2, 2));
    this.score = 0;

    this.moveCol = function(col, direction) {

	var canGoDeeper = function(c, idx, value, min_y) {
	    return (idx >= min_y && (c[idx] === 0 || (c[idx] === value)));  
	};

	var miny = 0;
	for (y = 1; y < 4; y++) {	   
	    var v = col[y];
	    if (v === 0)
		continue;
	    col[y] = 0;
	    var ny = y - 1;

	    var destination = y;

	    while(canGoDeeper(col, ny, v, melted, miny)) {
		destination = ny;
		if (col[ny] === v) {
		    col[ny] = 0;
		    v *= 2;
		    miny = ny + 1;
		}
		ny--;
	    }
	    col[destination] = v;
	}
    }

    this.play = function(way) {
	var x,y = 0;
	switch (way) {
	case 1: //down
	    for (x = 0; x < 4; x++) {	
		this.moveCol(this.g[x], -1);
	    }
	    break;
	case 2:
	    break;
	case 3:
	    break;
	case 4:
	    break;
	}
    };
};



(function () {
    var p2 = 0.6;
    var p4 = 0.4;

    
})();


function dumpGrid(grid) {
    var html = "<ul>";
    for (var y = 3; y >= 0; y--) {
	html += "<li>";
	for (var x = 0; x < 4; x++) {
	    html += grid.g[x][y] + " ";
	}    
	html += "</li>";	
    }
    html += "</ul>";
    return html;
}

var g = new grid();
g.play(1);


document.write(dumpGrid(g));
