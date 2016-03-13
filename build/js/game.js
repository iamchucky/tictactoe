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
      return fetch('/checkAllDir', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(function(res) {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        }

        var error = new Error(res.statusText);
        error.response = res;
        throw error;
      });
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

      return this.checkAllDir(data)
        .then(function(res) {
          if (res.err) {
            throw res.err;
          }
          return res;
        });
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

          self.checkGameState()
            .then(function(res) {
              self.setPiece();

              if (res.win) {
                showWinningText(self.curPlayer + ' won');
                return;
              }

              // check ending condition
              var gameover = self.checkFull();
              if (!gameover) {
                self.nextPlayer();
              }
            })
            .catch(function(ex) {
              console.log(ex);
            });

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
