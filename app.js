var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('build'));
app.use(bodyParser.json());

function collectPieces(data, direction) {
  var j = data.row;
  var i = data.col;
  var count = 0;
  var out = [];

  while(1) {
    // 0 1 2
    // 3   4
    // 5 6 7
    switch (direction) {
      case 0:
        i--;
        j++;
        break;
      case 1:
        j++;
        break;
      case 2:
        i++;
        j++;
        break;
      case 3:
        i--;
        break;
      case 4:
        i++;
        break;
      case 5:
        i--;
        j--;
        break;
      case 6:
        j--;
        break;
      case 7:
        i++;
        j--;
        break;
    }

    count++;
    // we don't count more than 2 pieces away from the curColRow
    if (count > 2) {
      break;
    }

    // break if out of the bound
    if (i < 0 || j < 0 || i >= data.cols || j >= data.rows) {
      break;
    }

    var key = 'c'+i+'r'+j;
    // break if there is no such piece
    if (!data.board[key]) {
      break;
    }
    // break if the color is different
    if (data.board[key] != data.player) {
      break;
    }

    out.push(data.board[key]);
  }
  return out;
}

app.post('/checkAllDir', function (req, res) {
  if (!req.body) {
    return res.json({ err: 'invalid input' });
  }

  var data = req.body;
  var directions = [ 
        [3, 4], // check row
        [1, 6], // check col
        [5, 2], // check diagonal 1
        [0, 7]  // check diagonal 2
  ];

  for (var i = 0; i < directions.length; ++i) {
    var pieces = [];
    for (var j = 0; j < directions[i].length; ++j) {
      pieces = pieces.concat(collectPieces(data, directions[i][j]));
    }

    // if we have found 2 pieces apart from current position, this player win
    if (pieces.length >= 2) {
      return res.json({ win: true });
    }
  }

  return res.json({ win: false });
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
