// test/Box.js
// Load dependencies
const { expect } = require('chai');
const { time } = require('@openzeppelin/test-helpers');
 
let Box;
let box;
 
// Start test block
describe('Box', function () {

  // Test case
  it('Test Staking', async function () {
    // Store a value
    const [owner, addr1] = await ethers.getSigners();
    Token = await ethers.getContractFactory("UpgradeableERC20");
    initialize = await upgrades.deployProxy(Token, ["Rtoken", "RDT",18,1000000], { initializer: 'initialize' });

    //mytoken = await Token.deploy();
    mytoken = await initialize.deployed();
    const ownerBalance = await mytoken.balanceOf(owner.address);
    console.log("Owner balance",ownerBalance);


    await mytoken.connect(addr1).buy(200,{value: ethers.utils.parseEther("20.1")});
  //  await mytoken.connect(addr1).buy(200,{value: ethers.utils.parseUnits("20","wei")});

    const addr1Balance2 = await mytoken.balanceOf(addr1.address);



    
    console.log("addr1Balance balance#2",addr1Balance2);

    //console.log("BALANCE CONTRACT after buy",await mytoken.balanceOf(owner.address));
    //console.log("Total Supply after buy",await mytoken.totalSupply());
   // console.log("BALANCE Supply after buy",await mytoken.getBalance());


    // prov = ethers.getDefaultProvider();
    // console.log("BALANCE CONTRACT",await prov.getBalance(mytoken.address));



    const setTime = await mytoken.setTimestamp(120);

    await mytoken.connect(addr1).stakeTokens(200);





    console.log("addr1Balance balance  #3", await mytoken.balanceOf(addr1.address));


    
    await ethers.provider.send("evm_increaseTime", [160]);

    await mytoken.connect(addr1).unstakeTokens(200);


    console.log("addr1Balance balance  #4", await mytoken.balanceOf(addr1.address));

    
    //const testSwap = await mytoken.getEstimatedETHforToken(100);

    //testSwap.wait();

    //console.log("swaping",testSwap);



    
    //await mytoken.connect(addr1).convertTokenToETH(100);

    //const setTime = await mytoken.connect(owner).setTimestamp(120);

    //await time.increase(time.duration.minutes(3)); // change time



    
    //await box.store(42);
 
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    //expect((await box.retrieve()).toString()).to.equal('42');
  });
});