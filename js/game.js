(function (root) {
    'use strict';

    var WIN_CONFIG = [
        {win: 'rock', lose: 'scissors'},
        {win: 'scissors', lose: 'paper'},
        {win: 'paper', lose: 'rock'}
    ];
    var CHOICES = WIN_CONFIG.map(function (row) {
        return row.win;
    });
    var RESULTS = {
        tie: 'tie',
        win: 'win',
        lose: 'lose'
    };

    function _compare (choice1, choice2) {
        if (choice1 === choice2) {
            return RESULTS.tie;
        }

        for (var i = 0, len = WIN_CONFIG.length; i < len; i++) {
            var row = WIN_CONFIG[i];
            var winChoice = row.win;
            var loseChoice = row.lose;

            if (choice1 === winChoice && choice2 === loseChoice) {
                return RESULTS.win;
                break;
            }
        }

        return RESULTS.lose;
    }

    function _randomIndex () {
        return Math.floor(Math.random() * CHOICES.length);
    }

    function _randomChoice () {
        return CHOICES[_randomIndex()];
    }

    function _formatResult (choice1, choice2) {
        return {
            result: _compare(choice1, choice2),
            choice1: choice1,
            choice2: choice2
        };
    }

    var VDGame = {
        RESULTS: RESULTS,

        CHOICES: CHOICES,

        playerVsComputer: function (playerChoice) {
            if (CHOICES.indexOf(playerChoice) === -1) {
                throw new Error('Provided choice is not possible');
            }
            var computerChoice = _randomChoice();
            return _formatResult(playerChoice, computerChoice);
        },

        computerVsComputer: function () {
            var computerChoice1 = _randomChoice();
            var computerChoice2 = _randomChoice();
            return _formatResult(computerChoice1, computerChoice2);
        }
    };

    root.VDGame = VDGame;

})(this);
