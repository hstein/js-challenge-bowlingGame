(function() {
    "use strict";

    /**
     * A bowling game implementation with
     * the goal to visualize its scoring
     * system. It uses random player
     * throws and does not represent a
     * full playable game.
     *
     * - in plain JavaScript
     * - improvements:
     *      # unit tests for production env
     */

    var gameInstance;

    /**
     * Game
     */
    var Game = (function() {

        var Class = function() {

            this._settings = {
                                "frameAmount": 10,
                                "turnsPerFrame": 2,
                                "pinAmount": 10
                             };
            this._players = [];
            this._pinsLeft = this._settings.pinAmount;
            this._results = [];
            this._breakTurn = false;
            this._drawSymbol = '';

        };

        Class.prototype = {

            init: function init() {

                // the game requires at least one player
                if(this._players.length === 0) throwCustomError('BadPlayerAmount', 'The game requires at least one player.');

                // draw the scoreboard
                this.drawScoreBoard();

                // automatically play the game
                this.autoPlayFullGame();

            },

            addPlayer: function addPlayer(player) {
                if(player instanceof Player) this._players.push(player);
            },

            roll: function roll() {
                var pins = Math.floor(Math.random() * (this._pinsLeft + 1));
                this._pinsLeft -= pins;

                return pins;
            },

            autoPlayFullGame: function autoPlayFullGame() {

                var currentFrame;
                var currentPlayerIndex;
                var currentTurn;

                // in each frame
                for(currentFrame = 1; currentFrame <= this._settings.frameAmount; currentFrame++) {

                    // each player
                    for(currentPlayerIndex = 0; currentPlayerIndex < this._players.length; currentPlayerIndex++) {

                        // rolls his turns
                        for(currentTurn = 1; currentTurn <= this._settings.turnsPerFrame; currentTurn++) {

                            this.performTurn(currentPlayerIndex, currentFrame, currentTurn);
                            if(this._breakTurn) {
                                this._breakTurn = false;
                                break;
                            }

                        }

                    }

                    // bonus turns
                    if(currentFrame === this._settings.frameAmount) {
                        this.performBonusTurns(currentFrame);
                    }

                }

            },

            performTurn: function performTurn(playerIndex, frameNumber, turnNumber) {

                var turnResult;
                var turnResultWithBonus;
                var result;

                turnResult = this.roll();
                turnResultWithBonus = this.calculateTurnScore(playerIndex, turnResult, turnNumber, frameNumber);

                // store results
                result = {
                    frame:  frameNumber,
                    turn:   turnNumber,
                    playerIndex:    playerIndex,
                    result:         turnResult,
                    resultWithBonus: turnResultWithBonus
                };
                this._results.push(result);
                this._players[playerIndex].addScore(turnResultWithBonus);

                // use data
                this.gameLog(result);

                // bonuses only apply to next round
                this.checkForStrike(turnNumber, playerIndex);
                this.checkForSpare(turnNumber, playerIndex);

                this.drawTurnData(playerIndex, frameNumber, turnNumber, turnResult);

                // reset pins for next player
                if(turnNumber === this._settings.turnsPerFrame) this._pinsLeft = this._settings.pinAmount;

            },

            performBonusTurns: function performBonusTurns(currentFrame) {

                var currentPlayerIndex,
                    nextTurn = this._settings.turnsPerFrame + 1,
                    currentTurn;

                // each player
                for(currentPlayerIndex = 0; currentPlayerIndex < this._players.length; currentPlayerIndex++) {

                    if(this._players[currentPlayerIndex]._hadSpare) {

                        this._players[currentPlayerIndex]._hadSpare = 0;

                        this.performTurn(currentPlayerIndex, currentFrame, nextTurn);

                    }else if(this._players[currentPlayerIndex]._hadStrike){

                        this._players[currentPlayerIndex]._hadStrike = 0;

                        // rolls his turns
                        for(currentTurn = nextTurn; currentTurn < (nextTurn + this._settings.turnsPerFrame); currentTurn++) {
                            this.performTurn(currentPlayerIndex, currentFrame, currentTurn);
                        }

                    }

                }

            },

            calculateTurnScore: function calculatePlayerScore(playerIndex, turnResult, turnNumber, frameNumber) {

                // had spare
                if(this._players[playerIndex]._hadSpare) {
                    this.redrawTotal(playerIndex, frameNumber-1, turnResult);
                    turnResult += turnResult;
                    this._players[playerIndex]._hadSpare = 0;
                }

                // had strike
                if(this._players[playerIndex]._hadStrike) {
                    this.redrawTotal(playerIndex, frameNumber-1, turnResult);
                    turnResult += turnResult;
                    if(turnNumber === this._settings.turnsPerFrame) this._players[playerIndex]._hadStrike = 0;
                }

                return turnResult;

            },

            checkForSpare: function checkForSpare(turnNumber, playerIndex) {

                if(turnNumber !== 1 && this._pinsLeft === 0) {
                    this._players[playerIndex]._hadSpare = 1;
                    this._drawSymbol = '/';
                    this.endTurn();
                }

            },

            checkForStrike: function checkForStrike(turnNumber, playerIndex) {

                if(turnNumber === 1 && this._pinsLeft === 0) {
                    this._players[playerIndex]._hadStrike = 1;
                    this._drawSymbol = 'X';
                    this.endTurn();
                }

            },

            endTurn: function endTurn() {
                this._breakTurn = true;
                this._pinsLeft = this._settings.pinAmount;
            },

            gameLog: function gameLog(result) {

                var node = document.querySelector('.js-game-log');
                node.innerHTML = node.innerHTML + '<li><i>' + this._players[result.playerIndex]._name + '</i> has scored <b>' + result.result + '</b> pins (Frame: '+result.frame+', Turn: '+result.turn+')</li>';

            },

            drawScoreBoard: function drawScoreBoard() {

                var html = '<table class="table table-bordered">',
                    scoreBoard,
                    playerIndex,
                    currentFrame,
                    playerTurn;

                for (playerIndex = 0; playerIndex < this._players.length; playerIndex++) {

                    html += '<tr class="player-'+playerIndex+'">';

                    html += '<td class="text-right"><b>'+this._players[playerIndex]._name+':</b></td>';

                    for(currentFrame = 1; currentFrame <= this._settings.frameAmount; currentFrame++) {

                        html += '<td class="text-center frame-'+currentFrame+'">';

                        for(playerTurn = 1; playerTurn <= this._settings.turnsPerFrame; playerTurn++) {

                            html += '<span class="badge player-'+playerIndex+'-frame-'+currentFrame+'-roll-'+playerTurn+'"></span> ';

                        }

                        html += '<div class="text-center turn-total player-'+playerIndex+'-frame-'+currentFrame+'-total"></div>';

                        html += '</td>';

                    }

                    html += '</tr>';

                }

                html += '</table>';

                scoreBoard = document.querySelector('.js-scoreboard');
                scoreBoard.innerHTML = html;

            },

            drawTurnData: function drawTurnData(playerIndex, frameNumber, turnNumber, pins) {

                var score = pins,
                    doc,
                    counter;

                if(this._drawSymbol === '/' || this._drawSymbol === 'X') {
                    doc = document.querySelectorAll('.player-'+playerIndex+' .frame-'+frameNumber+' .badge');
                    for(counter = (turnNumber-1); counter < doc.length; counter++) {
                        doc[counter].innerHTML = '-';
                    }
                    score =  this._drawSymbol;
                    this._drawSymbol = '';
                }

                doc = document.querySelector('.player-'+playerIndex+'-frame-'+frameNumber+'-roll-'+turnNumber);

                if(!doc) {
                    doc = document.querySelector('.player-'+playerIndex+' .frame-'+frameNumber);
                    doc.innerHTML = doc.innerHTML + '<span class="bonus small">['+score+']</span> ';
                    console.log(doc);
                }else {
                    doc.innerHTML = score;
                }

                doc = document.querySelector('.player-'+playerIndex+'-frame-'+frameNumber+'-total');
                doc.innerHTML = this._players[playerIndex]._totalScore;

            },

            redrawTotal: function redrawTotal(playerIndex, frameNumber, score) {
                var doc = document.querySelector('.player-'+playerIndex+'-frame-'+frameNumber+'-total');
                doc.innerHTML = parseInt(doc.innerHTML) + score;
            }

        };

        return Class;

    })();

    /**
     * Player
     */
    var Player = (function(name) {

        var Class = function(name) {

            this._name = name || 'John Doe';
            this._totalScore = 0;
            this._hadSpare = 0;
            this._hadStrike = 0;

        };

        Class.prototype = {

            addScore: function addScore(score) {
                this._totalScore += score;
            }

        };

        return Class;

    })();

    /**
     * Helpers
     */
    function throwCustomError(name, message) {
        throw { name: name, message: message, toString: function(){return this.name + ": " + this.message;} };
    }

    /**
     * Game creation
     */
    gameInstance = new Game();
    gameInstance.addPlayer(new Player('Hannes S.'));
    gameInstance.init();

})();