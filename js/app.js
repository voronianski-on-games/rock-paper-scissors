(function (root, VDGame) {
    'use strict';

    /*
     * App
     */
    function VDApp (options) {
        options = options || {};

        if (!options.el) {
            throw new Error('Element selector string `el` option is required');
        }

        var $el = document.querySelector(options.el);

        if (!$el) {
            throw new Error('There is no DOM element with selector `' + $el + '`');
        }

        var privateMethods = {};
        var publicMethods = {};

        // child views
        var welcomeView;
        var gameView;

        privateMethods.createViews = function () {
            welcomeView = VDWelcomeView({
                onGameClick: privateMethods.renderGameView
            });
            gameView = VDGameView({
                onGameResult: privateMethods.renderGameView,
                onReplayClick: privateMethods.renderGameView
            });
        };

        privateMethods.cleanViews = function () {
            while ($el.firstChild) {
                $el.removeChild($el.firstChild);
            }
        };

        privateMethods.renderGameView = function (result) {
            privateMethods.cleanViews();
            $el.appendChild(gameView.render(result));
        };

        privateMethods.renderWelcomeView = function () {
            $el.appendChild(welcomeView.render());
        };


        publicMethods.render = function () {
            privateMethods.createViews();
            privateMethods.renderWelcomeView();
        };

        return publicMethods;
    }

    /*
     * Welcome View
     */
    function VDWelcomeView (handlers) {
        handlers = handlers || {};

        var ACTIONS = [
            {player: 'manual', text: 'Player vs. Computer'},
            {player: 'auto', text: 'Computer vs. Computer'}
        ];

        var privateMethods = {};
        var publicMethods = {};

        privateMethods.renderLogo = function () {
            var $logo = document.createElement('div');
            $logo.className = 'vd-logo';
            return $logo;
        };

        privateMethods.renderActionButtons = function () {
            var $wrapper = document.createElement('div');

            var domFragment = document.createDocumentFragment();
            ACTIONS.forEach(function (action) {
                var $btn = document.createElement('button');
                $btn.type = 'button';
                $btn.className = 'btn btn-primary h5 bg-fuchsia vd-action-btn';
                $btn.innerHTML += action.text;
                $btn.addEventListener('click', function () {
                    if (typeof handlers.onGameClick === 'function') {
                        handlers.onGameClick({player: action.player});
                    }
                }, false);
                domFragment.appendChild($btn);
            });
            $wrapper.appendChild(domFragment);

            return $wrapper;
        };

        publicMethods.render = function () {
            var $el = document.createElement('div');

            var $logo = privateMethods.renderLogo();
            var $actionBtns = privateMethods.renderActionButtons();

            $el.appendChild($logo);
            $el.appendChild($actionBtns);

            return $el;
        };

        return publicMethods;
    }

    /*
     * Game View
     */
    function VDGameView (handlers) {
        handlers = handlers || {};

        var RESULT_TEXTS = {
            manual: {
                tie: 'Tie, fighter..',
                win: 'Hooray! You win ^_^',
                lose: 'You loooooose :('
            },
            auto: {
                tie: 'Tie',
                win: 'Computer I wins!',
                lose: 'Computer II wins!'
            }
        };

        var privateMethods = {};
        var publicMethods = {};

        privateMethods.renderBattleField = function (props) {
            var $field = document.createElement('div');

            $field.className = 'vd-battle-field clearfix';
            $field.innerHTML += '\
                <div class="col col-5">\
                    <div class="vd-player-choice vd-' + (props.choice1 ? props.choice1 + '-img' : 'waiting') + '" data-name="' + (props.player === 'auto' ? 'computer I' : 'player') + '"></div>\
                </div>\
                <div class="col col-2">\
                    <div class="vd-player-choice-vs">vs.</div>\
                </div>\
                <div class="col col-5">\
                    <div class="vd-player-choice vd-' + (props.choice2 ? props.choice2 + '-img' : 'waiting') + '" data-name="' + (props.player === 'auto' ? 'computer II' : 'computer') + '"></div>\
                </div>';

            return $field;
        };

        privateMethods.renderMessage = function (props) {
            var $message = document.createElement('div');

            $message.className = 'h3 bold px2 mt3 vd-message';

            if (!props.result) {
                $message.textContent += (props.player === 'manual') ? 'Please, make your choice:' : 'Push the button!';
            } else {
                $message.textContent = RESULT_TEXTS[props.player][props.result];
            }

            return $message;
        };

        privateMethods.renderReplayButton = function (props) {
            var $btn = document.createElement('button');

            $btn.type = 'button';
            $btn.className = 'btn btn-primary bg-fuchsia h4 mt2';
            $btn.textContent = 'Replay?';
            $btn.addEventListener('click', function () {
                if (typeof handlers.onReplayClick === 'function') {
                    handlers.onReplayClick({player: props.player});
                }
            }, false);

            return $btn;
        };

        privateMethods.renderAutoPlayButton = function () {
            var $btn = document.createElement('button');

            $btn.type = 'button';
            $btn.className = 'btn btn-primary bg-fuchsia h4 mt2';
            $btn.textContent = 'Let Them Play!';
            $btn.addEventListener('click', function () {
                privateMethods.playAutoGame();
            }, false);

            return $btn;
        };

        privateMethods.playManualGame = function (choice) {
            if (typeof handlers.onGameResult === 'function') {
                var result = VDGame.playerVsComputer(choice);

                result.player = 'manual';
                handlers.onGameResult(result);
            }
        };

        privateMethods.playAutoGame = function () {
            if (typeof handlers.onGameResult === 'function') {
                var result = VDGame.computerVsComputer();

                result.player = 'auto';
                handlers.onGameResult(result);
            }
        };

        privateMethods.renderChoiceButtons = function (props) {
            var $wrapper = document.createElement('div');
            var domFragment = document.createDocumentFragment();

            VDGame.CHOICES.forEach(function (choice) {
                var $btn = document.createElement('button');
                $btn.type = 'button';
                $btn.className = 'btn vd-select-btn vd-' + choice + '-img';
                $btn.setAttribute('data-choice', choice);

                if (props.choice1 === choice) {
                    $btn.className += ' active';
                }

                if (props.result) {
                    $btn.disabled = true;
                }

                $btn.addEventListener('click', function () {
                    privateMethods.playManualGame(choice);
                }, false);

                domFragment.appendChild($btn);
            });

            $wrapper.appendChild(domFragment);

            return $wrapper;
        };

        publicMethods.render = function (props) {
            props = props || {};

            var $el = document.createElement('div');
            var $field = privateMethods.renderBattleField(props);
            var $message = privateMethods.renderMessage(props);

            $el.appendChild($field);
            $el.appendChild($message);

            if (props.player === 'manual') {
                if (props.result) {
                    var $replayBtn = privateMethods.renderReplayButton(props);
                    $el.appendChild($replayBtn);
                }

                var $buttons = privateMethods.renderChoiceButtons(props);
                $el.appendChild($buttons);
            }
            if (props.player === 'auto') {
                var $autoPlayBtn = privateMethods.renderAutoPlayButton();
                $el.appendChild($autoPlayBtn);
            }

            return $el;
        };

        return publicMethods;
    }

    root.VDApp = VDApp;

})(this, this.VDGame);
