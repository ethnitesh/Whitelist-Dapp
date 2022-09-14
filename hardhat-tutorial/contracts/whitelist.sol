// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Whitelist{
    //  max number of addresses which can be whitelisted;
 uint8 public maxWhitelistAddress;
 
//  keep track of number of address whitelisted till now;
 uint8 public numAddressesWhitelisted;

mapping(address => bool) public whitelistedAddresses;

    constructor(uint8 _maxWhitelisteAddress){
        maxWhitelistAddress =_maxWhitelisteAddress;
    }

    function addAddressToWhitelisted() public {
 
    //    msg.sender is the address of the user who called the function;
        require(!whitelistedAddresses[msg.sender], "already whitelisted");
        require(numAddressesWhitelisted < maxWhitelistAddress, "max limit reached");
        whitelistedAddresses[msg.sender]= true;
        numAddressesWhitelisted += 1;
    }
}
