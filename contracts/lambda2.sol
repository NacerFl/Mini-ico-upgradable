  // SPDX-License-Identifier: MIT

  pragma solidity >=0.7.0 <0.9.0;

  //import "ERC721Enumerable.sol";
  import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
  import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

  import "@openzeppelin/contracts/access/Ownable.sol";

  import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

  import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


  contract Lambda2 is ERC721Enumerable, Ownable {
    using Strings for uint256;

      using ECDSA for bytes32;
  string public baseURI;
    string public notRevealedUri;

  mapping(address => uint256) public addressMintedBalance;

    bool public mintOpen = false;

    address private _signerAddress = 0xd24af218338dc6a63706cCf7A30a3919DD34A951;

    constructor(
      string memory _name,
      string memory _symbol,
      string memory _initBaseURI,
      string memory _initNotRevealedUri
      
    ) ERC721(_name, _symbol) {
      //breedAddress2 = ERC721(_breedAddress);
    // setBaseURI(_initBaseURI);
      //setNotRevealedURI(_initNotRevealedUri);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
      return baseURI;
    }


    function setMintOpen(bool value) public onlyOwner {

        mintOpen = value;

    }


    // public
    function mint(uint256 _mintAmount,address sender) public payable {
        require(mintOpen = true);
      uint256 supply = totalSupply();
      addressMintedBalance[address(this)]++;


      for (uint256 i = 1; i <= _mintAmount; i++) {
        _safeMint(sender, supply + i);
      }
    }


    

      function onERC721Received(
          address,
          address,
          uint256,
          bytes memory
      ) public virtual  returns (bytes4) {
          return this.onERC721Received.selector;
      }



    function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
    {
      uint256 ownerTokenCount = balanceOf(_owner);
      uint256[] memory tokenIds = new uint256[](ownerTokenCount);
      for (uint256 i; i < ownerTokenCount; i++) {
        tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
      }
      return tokenIds;
    }

  


function airdropv2(address walletTo,uint256 nbrNft) public payable onlyOwner{
        uint256 supply = totalSupply();
        //require(supply  <= maxSupply, "max NFT limit exceeded");

        for (uint256 i = 1; i <= nbrNft; i++) {
            

            
      addressMintedBalance[walletTo]++;
      _safeMint(walletTo, supply + i);

      
    } 

    }



      
  }