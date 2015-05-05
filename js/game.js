(function() {
    "use strict";

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

        };

        Class.prototype = {

            init: function init() {

                // the game requires at least one player
                if(this._players.length == 0) throwCustomError('BadPlayerAmount', 'The game requires at least one player.');

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

                }

            },

            performTurn: function performTurn(playerIndex, frameNumber, turnNumber) {

                var turnResult;
                var turnResultWithBonus;

                turnResult = this.roll();
                turnResultWithBonus = this.calculateTurnScore(playerIndex, turnResult, turnNumber);

                this._results.push({
                    frame:  frameNumber,
                    turn:   turnNumber,
                    playerIndex:    playerIndex,
                    result:         turnResult,
                    resultWithBonus: turnResultWithBonus
                });

                // bonuses only apply to next round
                this.checkForStrike(turnNumber, playerIndex);
                this.checkForSpare(turnNumber, playerIndex);

                // reset pins for next player
                if(turnNumber === this._settings.turnsPerFrame) this._pinsLeft = this._settings.pinAmount;

            },

            calculateTurnScore: function calculatePlayerScore(playerIndex, turnResult, turnNumber) {

                // had spare
                if(this._players[playerIndex].hadSpare) {
                    turnResult += turnResult;
                    this._players[playerIndex].hadSpare = 0;
                }

                // had strike
                if(this._players[playerIndex].hadStrike) {
                    turnResult += turnResult;
                    if(turnNumber === this._settings.turnsPerFrame) this._players[playerIndex].hadStrike = 0;
                }

                return turnResult;

            },

            checkForSpare: function checkForSpare(turnNumber, playerIndex) {

                if(turnNumber !== 1 && this._pinsLeft === 0) {
                    this._players[playerIndex].hadSpare = 1;

                    this.endTurn();
                }

            },

            checkForStrike: function checkForStrike(turnNumber, playerIndex) {

                if(turnNumber === 1 && this._pinsLeft === 0) {
                    this._players[playerIndex].hadStrike = 1;

                    this.endTurn();
                }

            },

            endTurn: function endTurn() {
                this._breakTurn = true;
                this._pinsLeft = this._settings.pinAmount;
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
    gameInstance.addPlayer(new Player('Peter Pan'));
    gameInstance.addPlayer(new Player());
    gameInstance.init();
    console.log(gameInstance._results);

})();