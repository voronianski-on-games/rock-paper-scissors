'use strict';

var VDGame = window.VDGame;

describe('game module', function () {
    it('should exist', function () {
        expect(VDGame).to.be.ok;
    });

    it('should have choices', function () {
        expect(VDGame.CHOICES).to.be.an('array').and.to.have.length(3);
    });

    describe('when playing vs computer', function () {
        describe('when providing NOT correct choice', function () {
            it('should throw error', function () {
                expect(VDGame.playerVsComputer.bind(null, 'foo')).to.throw(Error);
            });
        });

        describe('when providing correct choice', function () {
            it('should return result', function () {
                var r = VDGame.playerVsComputer('paper');

                expect(VDGame.RESULTS).to.contain.keys(r.result);
                expect(VDGame.CHOICES).to.contain(r.choice1);
                expect(VDGame.CHOICES).to.contain(r.choice2);

                expect(r.choice1).to.equal('paper');
                if (r.choice2 === 'scissors') {
                    expect(r.result).to.equal('lose');
                }

                if (r.choice2 === 'rock') {
                    expect(r.result).to.equal('win');
                }

                if (r.choice2 === 'paper') {
                    expect(r.result).to.equal('tie');
                }
            });
        });
    });

    describe('when playing computer vs computer', function () {
        it('should return result', function () {
            var r = VDGame.computerVsComputer();

            expect(VDGame.RESULTS).to.contain.keys(r.result);
            expect(VDGame.CHOICES).to.contain(r.choice1);
            expect(VDGame.CHOICES).to.contain(r.choice2);
        });
    });
});
