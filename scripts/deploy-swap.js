const { expect } = require("chai");
const hre = require("hardhat");



async function main() {

    const [owner,addr1] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("UpgradeableERC20");

    const nft = await hre.ethers.getContractFactory("Lambda2");

    const nftdeploy =await nft.deploy("rendut","rtd","ipfs://","ipfs://hidden");
  await nftdeploy.deployed();


  console.log("nftdeploy deployed to:", nftdeploy.address);

    const initialize = await hre.upgrades.deployProxy(Token, ["Rtoken", "RDT",18,1000000], { initializer: 'initialize' });

    const hardhatToken = await initialize.deployed();


    //await hardhatToken.deployed();

    //const initialize = await Token.initialize("Rtoken", "RDT",18,1000000);

    console.log("Token deployed to:", hardhatToken.address);

    const ownerBalance = await hardhatToken.balanceOf(owner.address);

    console.log("Owner balance",ownerBalance);

    const uniAddr = await hardhatToken.uniswapAddr();

    console.log("Uniswap ROUTER address",uniAddr);



   // const addr1Balance = await hardhatToken.balanceOf(addr1.address);

    //console.log("addr1Balance balance#1",addr1Balance);

    //await hardhatToken.connect(addr1).buy(200,{value:hre.ethers.utils.parseEther("20.1")});

   // const addr1Balance2 = await hardhatToken.balanceOf(addr1.address);

    //console.log("addr1Balance balance#2",addr1Balance2);

   // const approve = await hardhatToken.approve(owner.address,100);
   //let liquid = await hardhatToken.addLiquidity(2000,hre.ethers.utils.parseEther("1")) <= Marche pas

     //const testSwap = await hardhatToken.convertTokenToETH(100);<= Marche pas

    // testSwap.wait();

    // console.log("swaping",testSwap);
    

    //const setTime = await hardhatToken.setTimestamp(20);








}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });