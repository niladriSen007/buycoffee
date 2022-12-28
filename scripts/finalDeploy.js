const hre = require("hardhat");

async function main() {
    const coffee = await hre.ethers.getContractFactory("BuyMeACoffe");
    const contract = await coffee.deploy();

    console.log(`Hi`)
    await contract.deployed(); 
    console.log(`Address of the owner Contract is ${contract.address}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });