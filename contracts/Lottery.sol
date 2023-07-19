//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract Lottery {
    address payable public manager;
    address payable[] public players;
    address public lastWinner;
    constructor() {
        manager = payable(msg.sender);
    }
    function enter() public payable {
        require(msg.value > 0.01 ether,'Please enter ether greater than 0.01');
        players.push(payable(msg.sender));
    }
    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }
    function random() private view returns(uint) {
        return uint(keccak256(abi.encode(msg.sender, block.timestamp, players)));
    }

    function pickWinner() public restricted returns (address){
        uint index = random() % players.length;
        lastWinner = players[index];
        players[index].transfer(address(this).balance);
        return players[index];
    }

    function resetGame() public {
        delete players;
        lastWinner = address(0);
        manager.transfer(address(this).balance);
    }
    modifier restricted {
        require(msg.sender == manager,'only contract owner can choose the winner of the lottery');
        _;
    }
}