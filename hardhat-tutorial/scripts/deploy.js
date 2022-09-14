const {ethers} = require("hardhat");

async function Main() {
  const WhitelistContract = await ethers.getContractFactory("Whitelist");
  const deployedWhitelistedContract = await WhitelistContract.deploy(10);
  await deployedWhitelistedContract.deployed();
  
  console.log("address of whitelisted contract", deployedWhitelistedContract.address);
}

Main()
.then(() => process.exit(0))
.catch((error) => { console.error(error);
process.exit(1); });
