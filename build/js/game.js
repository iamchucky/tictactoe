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

    collectPieces: function(direction) {
      var j = this.curColRow.row;
      var i = this.curColRow.col;
      var player = this.curPlayer;
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
        if (i < 0 || j < 0 || i >= cols || j >= rows) {
          break;
        }

        var key = 'c'+i+'r'+j;
        // break if there is no such piece
        if (!this.pieces[key]) {
          break;
        }
        // break if the color is different
        if (this.pieces[key] != this.curPlayer) {
          break;
        }

        out.push(this.pieces[key]);
      }
      return out;
    },

    checkAllDir: function() {
      var pieces = [];

      // check row
      pieces = pieces.concat(this.collectPieces(3));
      pieces = pieces.concat(this.collectPieces(4));
      if (pieces.length >= 2) {
        return true;
      }

      // check col
      pieces = [];
      pieces = pieces.concat(this.collectPieces(1));
      pieces = pieces.concat(this.collectPieces(6));
      if (pieces.length >= 2) {
        return true;
      }
      
      // check diagonal 1
      pieces = [];
      pieces = pieces.concat(this.collectPieces(5));
      pieces = pieces.concat(this.collectPieces(2));
      if (pieces.length >= 2) {
        return true;
      }
      
      // check diagonal 2
      pieces = [];
      pieces = pieces.concat(this.collectPieces(0));
      pieces = pieces.concat(this.collectPieces(7));
      if (pieces.length >= 2) {
        return true;
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

    setPiece: function(row, col) {
      var key = 'c'+col+'r'+row;
      if (this.pieces[key]) {
        return;
      }

      this.curColRow = {
        row: row,
        col: col
      };

      var cell = document.querySelector('#board .row .cell[row="'+row+'"][col="'+col+'"]');
      cell.classList.remove('empty');
      cell.classList.add(this.curPlayer);

      this.pieces[key] = this.curPlayer;
      return true;
    },

    checkGameState: function() {
      var self = this;
      var winner = this.checkAllDir();
      if (winner) {
        showWinningText(this.curPlayer + ' won');
        return;
      }

      // check ending condition
      var gameover = this.checkFull();
      if (!gameover) {
        this.nextPlayer();
      }
    },

    registerUIHandlers: function() {
      var self = this;
      var elem = document.getElementById('board');
      elem.addEventListener('click', function(e) {
        if (e.target.hasAttribute('row') && e.target.hasAttribute('col')) {
          var c = parseInt(e.target.getAttribute('col'));
          var r = parseInt(e.target.getAttribute('row'));

          var success = self.setPiece(r, c);
          if (success) {
            self.checkGameState();
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

})();
