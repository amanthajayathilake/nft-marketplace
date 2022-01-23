// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard{
  using Counters for Counters.Counter;

  Counters.Counter private _itemIds;  //call itemIds using counters
  Counters.Counter private _itemsSold; //call itemsSold using counters

  address payable owner; //determine who is the owner of the contract
  uint256 listingPrice = 0.025 ether; //listing price

  constructor() {
    owner = payable(msg.sender); //set owner as the sender
  }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  function getListingPrice() public view returns (uint256) {
    return listingPrice; //Returns the listing price of the contract
  }

  // Places an item for sale on the marketplace
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) 
  
  public payable nonReentrant {
    //nonReentrant basically prevent Reentrant attacks
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToMarketItem[itemId] =  MarketItem( //mapping
      itemId, nftContract, tokenId, payable(msg.sender), payable(address(0)), price, false
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId, nftContract, tokenId, msg.sender, address(0), price, false
    );
  }

  // Creates the sale of a marketplace item 
  function createMarketSale(
    address nftContract,
    uint256 itemId
  ) 
    public payable nonReentrant {
    //nonReentrant basically prevent Reentrant attacks
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;

    require(msg.value == price, "Please submit the asking price in order to complete your purchase");

    //Transfers ownership of the item, as well as funds between parties
    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;

    //pay
    _itemsSold.increment();
    payable(owner).transfer(listingPrice);
  }

  // Returns all unsold market items 
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;

        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}