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

        };

        Class.prototype = {

        };

        return Class;

    })();

    gameInstance = new Game();
    console.log(gameInstance._settings.frameAmount);

})();