
var canvas;
var context;
var cells = [];
var cellSize = 8;
var intervalId = 0;
var speed;
var maxSpeed;

function setup() {
    canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('mousedown', function(evt) {
      var mousePos = getMousePos(canvas, evt);
        if (cells[Math.floor(mousePos.x / cellSize)][Math.floor(mousePos.y / cellSize)] === 0) {
          cells[Math.floor(mousePos.x / cellSize)][Math.floor(mousePos.y / cellSize)] = 1;
        } else {
          cells[Math.floor(mousePos.x / cellSize)][Math.floor(mousePos.y / cellSize)] = 0;
        }
        draw();
    });
    
    context = canvas.getContext('2d');
    context.strokeStyle = '#e1e1e1';
    
    maxSpeed = document.getElementById('speedSlider').max;
    
    updateSize();
    init();
    stopGame();
}

function getMousePos(canvas, evt) {
var rect = canvas.getBoundingClientRect();
return {
x: evt.clientX - rect.left,
y: evt.clientY - rect.top
};
}

function startGame() {
if (intervalId === 0) {
    intervalId = setInterval(function() {update();}, (maxSpeed - speed) * 5);
    document.getElementById('startButton').style.display="none";
    document.getElementById('stopButton').style.display="inline";
  }
}

function stepGame() {
if (intervalId !== 0) {
stopGame();
  }
    update();
}

function stopGame() {
    clearInterval(intervalId);
    intervalId = 0;
    document.getElementById('startButton').style.display="inline";
    document.getElementById('stopButton').style.display="none";
}

function updateSpeed() {
  speed = document.getElementById('speedSlider').value;
    if (intervalId > 0) {
      stopGame();
      startGame();
    }
}			

function setCellsValue(x, y, val) {
    if ((cells.length > x) && (cells[x].length > y))
        cells[x][y] = val;
}

function init() {
        var gridWidth = Math.floor(canvas.width / cellSize);
        var gridHeight = Math.floor(canvas.height / cellSize);

        cells = [];
        for (var i=0; i<gridWidth; i++) {
                cells[i] = [];
                for (var j=0; j<gridHeight; j++) {
                        cells[i][j] = 0;
                }
        }
        
        populateStartPosition();
        
        draw();
        document.getElementById('speedSlider').value = 90;
        updateSpeed();
}

function updateSize() {
    cellSize = document.getElementById('sizeCombo').value;
      init();
  }

function populateStartPosition() {
    var startPosition = document.getElementById('startPositionCombo').value;
    if (startPosition === "Oscillators") {
      populateOscillators();
    } else if (startPosition === "Glider") {
      populateGlider();
    } else if (startPosition === "LightweightSpaceship") {
      populateLightweightSpaceship();
    } else if (startPosition === "GliderGun") {
      populateGliderGun();
    }
}

function populateOscillators() {
    // Prefilled cells
    [
            // Gosper glider gun
            [2, 1],[2, 2],[2, 3],
            [2, 7],[3, 7],[4, 7],[1, 8],[2, 8],[3, 8],
            [7, 2],[8, 2],[7, 3],[8, 3],[9, 4],[10, 4],[9, 5],[10, 5]
    ]
    .forEach(function(point) {
        setCellsValue(point[0], point[1], 1);
    });
}

function populateGlider() {
    // Prefilled cells
    [
            // Gosper glider gun
            [3, 1],[1, 2],[3, 2],[2, 3],[3, 3]
    ]
    .forEach(function(point) {
        setCellsValue(point[0], point[1], 1);
    });
}

function populateLightweightSpaceship() {
    // Prefilled cells
    [
            // Gosper glider gun
            [2, 1],[3, 1],[4, 1],[5, 1],[1,2],[5, 2],[5, 3],[1, 4],[4, 4]
    ]
    .forEach(function(point) {
        setCellsValue(point[0], point[1], 1);
    });
}

function populateGliderGun() {
    // Prefilled cells
    [
            // Gosper glider gun
            [1, 5],[1, 6],[2, 5],[2, 6],[11, 5],[11, 6],[11, 7],[12, 4],[12, 8],[13, 3],[13, 9],[14, 3],[14, 9],[15, 6],[16, 4],[16, 8],[17, 5],[17, 6],[17, 7],[18, 6],[21, 3],[21, 4],[21, 5],[22, 3],[22, 4],[22, 5],[23, 2],[23, 6],[25, 1],[25, 2],[25, 6],[25, 7],[35, 3],[35, 4],[36, 3],[36, 4],
    ]
    .forEach(function(point) {
        setCellsValue(point[0], point[1], 1);
    });

    [
            // Random cells
            // If you wait enough time these will eventually take part
            // in destroying the glider gun, and the simulation will be in a "static" state.
            [60, 47],[61,47],[62,47],
            [60, 48],[61,48],[62,48],
            [60, 49],[61,49],[62,49],
            [60, 51],[61,51],[62,51],
    ]
    .forEach(function(point) {
        setCellsValue(point[0], point[1], 2);
    });
}

function applyRule(oldCellValue, neighbours) {
    var newCellValue = 0;
    var numNeighbours = neighbours.count();
    if (oldCellValue > 0) {
      if (numNeighbours === 2 || numNeighbours === 3) {
        newCellValue = 1;
      } else {
        newCellValue = 0;
      }
    } else {
      if (numNeighbours === 3) {
        newCellValue = 1;
      } else {
        newCellValue = 0;
      }
    }
    return newCellValue;
  }

function update() {
        
        var result = [];
        
        function getNeighbours(x, y) {
            function _isFilled(x, y) {
                    return cells[x] && cells[x][y];
            }
                
            return {
                topLeft: _isFilled(x-1, y-1),
                middleLeft: _isFilled(x,   y-1),
                bottomLeft: _isFilled(x+1,   y-1),
                topMiddle: _isFilled(x-1,   y),
                bottomMiddle: _isFilled(x+1,   y),
                topRight: _isFilled(x-1,   y+1),
                middleRight: _isFilled(x,   y+1),
                bottomRight: _isFilled(x+1,   y+1),
                
                count: function () {
                    var amount = 0;
                    if (this.topLeft > 0) amount++;
                    if (this.middleLeft > 0) amount++;
                    if (this.bottomLeft > 0) amount++;
                    if (this.topMiddle > 0) amount++;
                    if (this.bottomMiddle > 0) amount++;
                    if (this.topRight > 0) amount++;
                    if (this.middleRight > 0) amount++;
                    if (this.bottomRight > 0) amount++;
                    
                    return amount;
                },
                
                mostCommonNeighbour: function () {
                    var counts = [];
                    if (this.topLeft > 0) counts[this.topLeft] = counts[this.topLeft]? counts[this.topLeft] + 1 : 1;
                    if (this.middleLeft > 0) counts[this.middleLeft] = counts[this.middleLeft]? counts[this.middleLeft] + 1 : 1;
                    if (this.bottomLeft > 0) counts[this.bottomLeft] = counts[this.bottomLeft]? counts[this.bottomLeft] + 1 : 1;
                    if (this.topMiddle > 0) counts[this.topMiddle] = counts[this.topMiddle]? counts[this.topMiddle] + 1 : 1;
                    if (this.bottomMiddle > 0) counts[this.bottomMiddle] = counts[this.bottomMiddle]? counts[this.bottomMiddle] + 1 : 1;
                    if (this.topRight > 0) counts[this.topRight] = counts[this.topRight]? counts[this.topRight] + 1 : 1;
                    if (this.middleRight > 0) counts[this.middleRight] = counts[this.middleRight]? counts[this.middleRight] + 1 : 1;
                    if (this.bottomRight > 0) counts[this.bottomRight] = counts[this.bottomRight]? counts[this.bottomRight] + 1 : 1;
                    
                    var maxCount = 0;
                    var maxIndex = 0;
                    for (i = 0; i<counts.length; i++) {
                      if (counts[i] > maxCount) {
                          maxIndex = i;
                            maxCount = counts[i];
                        }
                    }
                    return maxIndex;
                }
            };
        }
        
        for (x=0; x<cells.length; x++) {
          result[x] = [];
          for (y=0; y<cells[x].length; y++) {
              var neighbours = getNeighbours(x, y);
            try {
              result[x][y] = applyRule(cells[x][y], neighbours);
            } catch (e) {
              document.getElementById('errorMessages').innerHTML = e.message;
              return;
            }
          }
        }

        cells = result;
       
        draw();
}

function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        cells.forEach(function(row, x) {
                row.forEach(function(cell, y) {
                        context.beginPath();
                        context.rect(x*cellSize, y*cellSize, cellSize, cellSize);
                        if (cell > 0) {
                                context.fillStyle = 'Blue';
                                context.fill();
                        } else if (cell < 0) {
                                context.fillStyle = '#b1b1b1';
                                context.fill();
                        } else {
                                context.stroke();
                        }
                });
        });
    }