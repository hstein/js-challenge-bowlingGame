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
                                "rollsPerFrame": 2,
                                "pinAmount": 10
                             };
            this._players = [];
            this._pinsLeft = this._settings.pinAmount;

        };

        Class.prototype = {

            init: function init() {

                // the game requires at least one player
                if(_players.length == 0) throwCustomError('BadPlayerAmount', 'The game requires at least one player.');

                // automatically play the game
                this.autoPlay();

            },

            addPlayer: function addPlayer(player) {
                if(player instanceof Player) this._players.push(player);
            },

            roll: function roll() {
                var pins = Math.floor(Math.random() * (this._pinsLeft + 1));
                this._pinsLeft -= pins;

                return pins;
            },

            calculatePlayerScore: function calculatePlayerScore(playerIndex) {

            },

            autoPlay: function autoPlay() {

                var currentFrame;

                // in each frame
                for(currentFrame = 1; currentFrame <= this._settings.frameAmount; currentFrame++) {

                    // each player

                        // rolls his turns

                }

            }

        };

        return Class;

    })();

    /**
     * Player
     */
    var Player = (function(name) {

        var Class = function(name) {

            this.name = name || 'John Doe';
            this.totalScore = 0;

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
    console.log(gameInstance._players);

})();