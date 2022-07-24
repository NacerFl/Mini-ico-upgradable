// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
//import '@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol';
//import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';





contract UpgradeableERC20 is Initializable,OwnableUpgradeable {
    string public name; 
    string public symbol;
    uint8 public decimals;
    uint256 public supply;

    uint256 public constant tokenPrice = 0.1 ether; // 1 token for 5 wei

    //ERC721 public CurrentNftColl;

    mapping(address=>uint) public balances;
    mapping(address=>mapping(address=>uint)) public allowed;

    uint256 public initialTimestamp;
    bool public timestampSet;
    uint256 public timePeriod;
    uint256 public eligibleAmount;


    address burnAddress;
    address UNISWAP_V2_ROUTER ;
    address WETH;
    address pair;
    address _uniswapV2Pair;
    IUniswapV2Router02 public uniswapRouter;

    mapping(address => bool) public _isBlacklisted;

    mapping(address => uint) public _pending;
    mapping(address => uint256) public alreadyWithdrawn;
    event tokensStaked(address from, uint256 amount);
    event TokensUnstaked(address to, uint256 amount);
    event Transfer(address sender, address receiver, uint256 tokens);
    event Approval(address sender, address delegate, uint256 tokens);


    function initialize(string memory _name, string memory _symbol, uint8 _decimals,uint256 _supply) public initializer  {
        name=_name;
        symbol=_symbol;
        decimals=_decimals;
        supply=_supply;
        timestampSet = false;
        balances[msg.sender]=supply;

        __Ownable_init();
        
         burnAddress = 0x000000000000000000000000000000000000dEaD;
         UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
         WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
        uniswapRouter = IUniswapV2Router02(UNISWAP_V2_ROUTER);

         address pair =
             IUniswapV2Factory(uniswapRouter.factory()).getPair(
                 uniswapRouter.WETH(),
                 address(this)
             );

             // Pair not yet created
         if (pair == address(0)) {
             _uniswapV2Pair = IUniswapV2Factory(uniswapRouter.factory())
                 .createPair(uniswapRouter.WETH(), address(this));
         } else {
            _uniswapV2Pair = pair;
         }
    }

    //Classic Functions
    function blacklistMalicious(address account, bool value) external onlyOwner()
    {
        _isBlacklisted[account] = value;
    }

    function uniswapAddr() external view returns(address) {
        return UNISWAP_V2_ROUTER;
    }

    // It returns the total number of tokens that you have
    function totalSupply() external view returns(uint256){
        return supply  - balances[address(0)];
    } 

    function getBalance() public view returns (uint) {

    uint balance = address(this).balance;

    return balance;
  }

    // It returns how many tokens does this person have
    function balanceOf(address tokenOwner) external view returns(uint){
        return balances[tokenOwner];
    } 

    //It helps in transferring from your account to another person
    function transfer(address receiver, uint numTokens) external  returns(bool){
        require(balances[msg.sender] >= numTokens,  "Sender balance is not sufficient");
        require(balances[receiver] + numTokens >= balances[receiver], "Transfer would cause overflow");
        require(!_isBlacklisted[receiver], "Blacklisted address");

        balances[msg.sender]-=numTokens;
        balances[receiver]+=numTokens;
        emit Transfer(msg.sender,receiver,numTokens);
        return true;
    } 



    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] -=  tokens;
        allowed[from][msg.sender] =  tokens;
        balances[to] += tokens;
        emit Transfer(from, to, tokens);
        return true;
    }

    //Used to delegate authority to send tokens without token owner
    function approve(address delegate,uint numTokens) external returns(bool){
        allowed[msg.sender][delegate]=numTokens;
        emit Approval(msg.sender,delegate,numTokens);
        return true;
    }
    
    //How much has the owner delegated/approved to the delegate 
    function allowance(address owner, address delegate) external view returns(uint){
        return allowed[owner][delegate];
    } 


    
    function buy(uint256 _amount) external payable {
        //require (msg.value > 0,"neeed to pay");
      require(msg.value > _amount * tokenPrice, 'Need to send exact amount of wei');
        balances[address(this)] -= _amount;
        balances[msg.sender] += _amount;

        //transfer(address(this), _amount);
        emit Transfer(msg.sender, address(this), _amount);

    }

    function sell(uint256 _amount) external  {
        // decrement the token balance of the seller
        balances[msg.sender] -= _amount;
        balances[address(this)] += _amount;

        _pending[msg.sender] += _amount * tokenPrice;

       
        emit Transfer(msg.sender, address(this), _amount);
        
       this.transfer(address(this),_amount * tokenPrice);
    }

    function Burn(uint256 _value)  public onlyOwner(){

        this.transfer(burnAddress, _value);

    }

    function withdraw() public {

        uint256 amount = _pending[msg.sender];
       balances[msg.sender] += amount;

        _pending[msg.sender] = 0;

    }

    function airdropv1(address payable walletTo,uint256 amount) public payable onlyOwner{

        this.transfer(walletTo,amount);
    }


    //Stackin Function ####################
modifier timestampNotSet() {
        require(timestampSet == false, "The time stamp has already been set.");
        _;
    }

    // Modifier
    /**
     * @dev Throws if timestamp not set.
     */
    modifier timestampIsSet() {
        require(timestampSet == true, "Please set the time stamp first, then try again.");
        _;
    }

        /// @dev Sets the initial timestamp and calculates minimum staking period in seconds i.e. 3600 = 1 hour

function setTimestamp(uint256 _timePeriodInSeconds) public onlyOwner timestampNotSet  {
        timestampSet = true;
        initialTimestamp = block.timestamp;
        timePeriod = initialTimestamp += (_timePeriodInSeconds);
    }

    function stakeTokens(uint256 amount) public  {
       // require(token == erc20Contract, "You are only allowed to stake the official erc20 token address which was passed into this contract's constructor");
        require(amount <= balances[msg.sender], "Not enough STATE tokens in your wallet, please try lesser amount");
        balances[msg.sender] -= amount;
        balances[address(this)] += amount;

        //token.safeTransferFrom(msg.sender, address(this), amount);
        //balances[msg.sender] = balances[msg.sender].add(amount);
        emit tokensStaked(msg.sender, amount);
    }


      function unstakeTokens(uint256 amount) public timestampIsSet  {
        //require(balances[address(this)] >= amount, "Insufficient token balance, try lesser amount");
        if (block.timestamp >= timePeriod) {
            alreadyWithdrawn[msg.sender] = alreadyWithdrawn[msg.sender]+=(amount);
           // balances[msg.sender] = balances[msg.sender] - (amount);
            //this.transfer(msg.sender, amount);
            balances[msg.sender] += amount;
        balances[address(this)] -= amount;
            emit TokensUnstaked(msg.sender, amount);
        } else {
            revert("Tokens are only available after correct time period has elapsed");
        }
    }

  function getEstimatedETHforToken(uint daiAmount) public view returns (uint[] memory) {
        return uniswapRouter.getAmountsOut(daiAmount, getPathForTokentoETH());

    }


    //SWAP PART


//       function convertEthToToken(uint daiAmount) public payable {
//     uint deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
//     uniswapRouter.swapETHForExactTokens{ value: msg.value }(daiAmount, getPathForETHtoDAI(), address(this), deadline);
    
//     // refund leftover ETH to user
//     (bool success,) = msg.sender.call{ value: address(this).balance }("");
//     require(success, "refund failed");
//   }

//   function getPathForETHtoDAI() private view returns (address[] memory) {
//     address[] memory path = new address[](2);
//     path[0] = uniswapRouter.WETH();
//     path[1] = address(this);
    
//     return path;
//   }

 function addLiquidity(uint256 tokenAmount, uint256 ethAmount) external {
    require(this.approve(UNISWAP_V2_ROUTER, tokenAmount), 'approve failed.');

        uniswapRouter.addLiquidityETH{value: ethAmount}(
            address(this),                  // token address
            tokenAmount,                    // amountTokenDesired
            0, // slippage is unavoidable   // amountTokenMin
            0, // slippage is unavoidable   // amountAVAXMin
            address(this),                    // to address
            block.timestamp                 // deadline
        );
    }

  function convertTokenToETH(uint tokenAmount) public payable {
    require(this.transferFrom(msg.sender, address(this), tokenAmount), 'transferFrom failed.');
    require(this.approve(UNISWAP_V2_ROUTER, tokenAmount), 'approve failed.');
        require(this.approve(address(msg.sender), tokenAmount), 'approve failed.');

    uint deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
        address[] memory path = new address[](2);
    path[0] = address(this);
    path[1] = uniswapRouter.WETH();
   
    uniswapRouter.swapTokensForExactETH(tokenAmount,0,path, address(this), deadline);
    
    // refund leftover ETH to user
    //(bool success,) = msg.sender.call{ value: address(this).balance }("");
    //require(success, "refund failed");
  }

  function getPathForTokentoETH() private view returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = address(this);
    path[1] = uniswapRouter.WETH();
   
    
    return path;
  }

  // important to receive ETH
    receive() payable external {}

    // function swapTokenForETH(uint256 tokenAmount) public payable{

    //     address[] memory path = new address[](2);
    //     path[0] = address(this);
    //     path[1] = WETH;
    //         UniswapV2Router02(UNISWAP_V2_ROUTER).swapTokensForExactETH(
    //         tokenAmount,
    //         0, // accept any amount of ETH
    //         path,
    //         address(this),
    //         block.timestamp
    //     );
    // }
    


    //NFT STAKIN PART

    // function setEligibleAmount(uint256 _amount) public onlyOwner(){

    //     eligibleAmount = _amount;
    // }

    // function setNftAddress(ERC721 contractAddress) public onlyOwner{
    //     CurrentNftColl = contractAddress;
    // }

    // function getNft(address walletTo) public payable onlyOwner{

    //     require(balances[msg.sender] >= eligibleAmount);
    //     CurrentNftColl._mint(1, walletTo);
    // }
}