pragma solidity ^0.5.0;

pragma experimental ABIEncoderV2;

import "./FixedPoint.sol";
import "./MultiRole.sol";

import "openzeppelin-solidity/contracts/drafts/ERC20Snapshot.sol";


/**
 * @title UMA voting token
 * @dev Supports snapshotting and allows the Oracle to mint new tokens as rewards.
 */
contract VotingToken is ERC20Snapshot, MultiRole {

    enum Roles {
        // Can set the minter and burner.
        Governance,
        // Addresses that can mint new tokens.
        Minter,
        // Addresses that can burn tokens that address owns.
        Burner
    }

    constructor() public {
        _createExclusiveRole(uint(Roles.Governance), uint(Roles.Governance), msg.sender);
        _createSharedRole(uint(Roles.Minter), uint(Roles.Governance), new address[](0));
        _createSharedRole(uint(Roles.Burner), uint(Roles.Governance), new address[](0));
    }

    /**
     * @dev Mints `value` tokens to `recipient`, returning true on success.
     */
    function mint(address recipient, uint value) external onlyRoleHolder(uint(Roles.Minter)) returns (bool) {
        _mint(recipient, value);
        return true;
    }

    /**
     * @dev Burns `value` tokens owned by `msg.sender`.
     */
    function burn(uint value) external onlyRoleHolder(uint(Roles.Burner)) {
        _burn(msg.sender, value);
    }

    /**
     * @dev Returns the balance of `account` at `snapshotId`.
     */
    function fixedPointBalanceOfAt(address account, uint snapshotId) public view returns (FixedPoint.Unsigned memory) {
        // This token's balances are already stored the same way as FixedPoint.Unsigneds are (i.e., with a 10**18
        // factor).
        return FixedPoint.Unsigned(balanceOfAt(account, snapshotId));
    }
}
