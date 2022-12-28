// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const getBalance = async( address) =>{
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt); //as the balanceBigInt is in the form of BigInt so we will have to chaNGE IT TO A SPECIFIC TYPE AND WE ARE CHANGING IT TO ETHER
}

const showBalances = async(addresses) =>{
  for(const address of addresses)
  {
    const balance = await getBalance(address);
    console.log(`Account ${address} has ${balance} amount in their account`);
  }
}

const printMemos = async(memos) =>{
  for(const memo of memos)
  {
      const address =await  memo.address;
      const name =await memo.name;
      const message =await memo.message ;
      const time = await memo.timestamp;

      console.log(`${name} has send you a message - ${message} at ${time}`)
  }
}

async function main() {

  const [owner,user1,user2,user3] = await hre.ethers.getSigners(); //mainly amra destructure korchi from the getSigners method
  const coffee = await hre.ethers.getContractFactory("BuyMeACoffe");
  const contract = await coffee.deploy();  //ei deploy korle amar contract er akta insance create hoye jabe
    
  await contract.deployed(); //hardhat er private blockchain e deploy hoye jabe
  console.log(`Address of the owner Contract is ${contract.address}`)

  //storing addresses 
  const addresses = [owner.address,user1.address,user2.address];
  await showBalances(addresses);

  //sending some amount for testing
  const amount = {value:hre.ethers.utils.parseEther("2")};
  await contract.connect(user1).buyCoffee("Niladri","Hi bro",amount);
  await contract.connect(user2).buyCoffee("Rohit","Hi bro",amount);

  console.log("After buying Coffee");
  await showBalances(addresses);


  const memos = await contract.getMemos();
  await printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
