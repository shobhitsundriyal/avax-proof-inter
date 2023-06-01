// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract RPSLS {
        enum Moves { scissors, paper, rock, lizard, spock }
        Moves private player1Move;
        Moves private player2Move;
        uint8 constant moveMod = 5;
        bool isPLayer1Chance;
        bool isGameOngoing = false;

        address player1;
        address player2;
        uint8 public player1Score;
        uint8 public player2Score;
        uint8 constant maxSore = 3;
        address constant nullAddr = address(0);
        address public winner = nullAddr;

        constructor() {}

        function joinGame () public payable {
            require(!isGameOngoing, "Game is ongaoing!!");
            require(msg.value == 1e18, "Bet can be of 1 native coin");
            isPLayer1Chance = true;
            if (player1 == nullAddr) {
                player1 = msg.sender;
            } else {
                player2 = msg.sender;
                isGameOngoing = true;
            }
        }

        function resetStates() private {
            player2 = nullAddr;
            player1 = nullAddr;
            winner = nullAddr;
            isGameOngoing = false;
            isPLayer1Chance = true;
            player1Score = 0;
            player2Score = 0;
        }

        function playMove(Moves playerMove) public {
            require(msg.sender == player1 || msg.sender == player2, "Game don't recognize you");
            if(isPLayer1Chance && msg.sender == player1) {
                player1Move = playerMove;
                isPLayer1Chance = !isPLayer1Chance;
            } else if (!isPLayer1Chance && msg.sender == player2) {
                player2Move = playerMove;
                isPLayer1Chance = !isPLayer1Chance;

                if(player1Move != player2Move){
                    if ((uint8(player2Move) + 1)%5 == uint8(player1Move) || (uint8(player2Move) + 3)%5 == uint8(player1Move)){
                        player2Score += 1;
                        if (player2Score == maxSore) {
                            address player2Address = player2;
                            resetStates();
                            winner = player2Address;
                        }
                    } else {
                        player1Score += 1;
                        if (player1Score == maxSore) {
                            address player1Address = player1;
                            resetStates();
                            winner = player1Address;
                        }
                    }
                }
            } else {
                revert("This is not your chance");
            }
        }

        function withdrawWinnings() public {
            assert(msg.sender == winner); // taking all gas if not he winner
            bool sent = payable(winner).send(2e18);
            require(sent, "Transfer Failed");
            resetStates();
        }
    }