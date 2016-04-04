'use strict';
(function() {

  var cols = 3;
  var rows = 3;

  window.app = {} || window.app;

  // ties interaction
  app.Game = function() {
    // store the pieces created
    this.pieces = {};

    this.curPlayer = null;
    this.curColRow = null;
  };

  app.Game.prototype = {

    init: function() {
      this.registerUIHandlers();
      this.nextPlayer();
    },

    nextPlayer: function() {
      var player = 'o';
      if (this.curPlayer) {
        player = this.curPlayer == player ? 'x':'o';
      }

      this.curPlayer = player;
      var board = document.getElementById('board');
      board.classList.remove('x');
      board.classList.remove('o');
      board.classList.add(this.curPlayer);
    },

    checkAllDir: function(data) {
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
          return true;
        }
      }
    },

    checkFull: function() {
      // check whether the board is full
      var full = Object.keys(this.pieces).length == rows * cols;

      if (full) {
        // all reached full length
        showWinningText('Game Over');
      }

      return full;
    },

    getPieceKey: function(row, col) {
      return 'c'+col+'r'+row;
    },

    isEmpty: function(row, col) {
      var key = this.getPieceKey(row, col);
      return this.pieces[key] == undefined;
    },

    setPiece: function() {
      var row = this.curColRow.row;
      var col = this.curColRow.col;
      if (!this.isEmpty(row, col)) {
        return;
      }

      var key = this.getPieceKey(row, col);
      var cell = document.querySelector('#board .row .cell[row="'+row+'"][col="'+col+'"]');
      cell.classList.remove('empty');
      cell.classList.add(this.curPlayer);

      this.pieces[key] = this.curPlayer;
    },

    checkGameState: function() {
      if (!this.isEmpty(this.curColRow.row, this.curColRow.col)) {
        return;
      }

      var self = this;
      var data = {
        board: self.pieces,
        rows: rows,
        cols: cols,
        row: self.curColRow.row,
        col: self.curColRow.col,
        player: self.curPlayer
      };

      return this.checkAllDir(data);
    },


    registerUIHandlers: function() {
      var self = this;
      var elem = document.getElementById('board');
      elem.addEventListener('click', function(e) {
        if (e.target.hasAttribute('row') && e.target.hasAttribute('col')) {
          var c = parseInt(e.target.getAttribute('col'));
          var r = parseInt(e.target.getAttribute('row'));

          self.curColRow = {
            row: r,
            col: c
          };

          var result = self.checkGameState();
          self.setPiece();
          if (result) {
            showWinningText(self.curPlayer + ' won');
            return;
          }

          // check ending condition
          var gameover = self.checkFull();
          if (!gameover) {
            self.nextPlayer();
          }

        }
      });
    }
  };

  function showWinningText(str) {
    var elem = document.getElementById('winningText');
    if (elem) {
      elem.textContent = str;
      elem.style.display = 'block';
      setTimeout(function() {
        elem.style.opacity = 1;
      }, 10);
    }
  }

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

})();
