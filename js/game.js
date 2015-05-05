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

        };

        Class.prototype = {

            init: function init() {

            },

            addPlayer: function addPlayer(player) {
                this._players.push(player);
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

        };

        Class.prototype = {

        };

        return Class;

    })();

    /**
     * Game creation
     */
    gameInstance = new Game();
    gameInstance.addPlayer(new Player('Peter Pan'));
    gameInstance.addPlayer(new Player());
    console.log(gameInstance._players);

})();