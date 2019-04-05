pragma solidity ^0.5.0;

pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract Capabilities is ERC721 {
    function createToken(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}

contract CapabilityContractLauncher {
    constructor(address addr0, address addr1) public {
        Capabilities ocap = new Capabilities();

        CapabilityContract contractObj = new CapabilityContract(ocap);

        Delegation delegation = new Delegation(address(contractObj), address(ocap), 0, addr0);
        ocap.createToken(address(delegation), 0);
        ocap.createToken(addr1, 1);

        // TODO: Ensure no one can modify NFTs
    }
}

// TODO: Create a parent contract, and then define a concrete contract to pass in CapabilityContract
contract Delegation {
    address contractAddr;
    address ownerAddr;
    address ocapAddr;
    uint256 tokenId;

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    mapping(address => bool) delegates;

    constructor(address _contractAddr, address _ocapAddr, uint256 _tokenId, address _ownerAddr) public {
        contractAddr = _contractAddr;
        ocapAddr = _ocapAddr;
        tokenId = _tokenId;
        ownerAddr = _ownerAddr;
    }

    modifier onlyOwner {
        require(msg.sender == ownerAddr, "Must be owner to access function");
        _;
    }

    function permit(address delegate) public onlyOwner {
        delegates[delegate] = true;
    }

    function revoke(address delegate) public onlyOwner {
        delegates[delegate] = false;
    }

    function transfer(address newOwner) public onlyOwner {
        Capabilities(ocapAddr).safeTransferFrom(msg.sender, newOwner, tokenId);
    }

    function forward(uint value, bytes memory data) public payable {
        require(msg.sender == ownerAddr || delegates[msg.sender], "Does not have access to this function");
        // TODO: Restrict access to the one method
        contractAddr.call.value(value)(data);
    }

    // TODO: Implement onERC721Received
    // Detect a capabilities object, store this
    function onERC721Received(address from, address to, uint256 _tokenId) public view returns (bytes4) {
        if (from == ocapAddr && to == msg.sender && tokenId == _tokenId) {
            return _ERC721_RECEIVED;
        }
    }
}

contract CapabilityContract {
    event FnCall(address caller);

    Capabilities ocap;

    constructor(Capabilities _ocap) public {
        ocap = _ocap;
    }

    modifier access(uint256 ocapId) {
        require(msg.sender == ocap.ownerOf(ocapId), "Does not have access to function");
        _;
    }

    function fn0() public access(0) {
        emit FnCall(msg.sender);
    }

    function fn1() public access(1) {
        emit FnCall(msg.sender);
    }
}
