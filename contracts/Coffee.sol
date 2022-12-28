// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.8
pragma solidity ^0.8.8;

contract BuyMeACoffe
{
    struct Memo
    {
        address from;
        string name;
        string message;
        uint timestamp;
    }

    Memo[] memos;

    address payable owner ;

    constructor()
    {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _name,string memory _message) public payable
    {
        require(msg.value > 0,"Please pay some ether");
        memos.push(Memo(msg.sender,_name,_message,block.timestamp));
        owner.transfer(msg.value);
    }

    function getMemos() public view returns(Memo[] memory)
    {
        return memos;
    }
}