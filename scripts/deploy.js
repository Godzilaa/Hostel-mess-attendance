// scripts/deploy.js
import hre from "hardhat";

async function main() {
  console.log("🚀 Starting deployment of Hostel Mess Attendance contracts...\n");

  // Get the deployer account
  const signers = await hre.ethers.getSigners();
  
  if (signers.length === 0) {
    throw new Error("❌ No signers found! Please check your PRIVATE_KEY in .env file.");
  }

  const [deployer] = signers;
  
  if (!deployer || !deployer.address) {
    throw new Error("❌ Deployer account not found! Please check your PRIVATE_KEY in .env file.");
  }

  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    throw new Error("❌ Deployer account has no funds! Please add some testnet ETH.");
  }

  try {
    // Deploy MessToken contract with deployer as initial owner
    console.log("📦 Deploying MessToken contract...");
    const MessToken = await hre.ethers.getContractFactory("MessToken");
    const messToken = await MessToken.deploy(deployer.address);
    await messToken.waitForDeployment();
    
    const messTokenAddress = await messToken.getAddress();
    console.log("✅ MessToken deployed to:", messTokenAddress);

    // Verify deployment by calling a read function
    console.log("\n🔍 Verifying deployment...");
    const tokenOwner = await messToken.owner();
    console.log("📋 MessToken owner:", tokenOwner);
    
    const tokenURI = await messToken.uri(1);
    console.log("🔗 Token URI:", tokenURI);

    // Test minting functionality (optional)
    console.log("\n🧪 Testing contract functionality...");
    console.log("🏷️  Minting 10 meal tokens to deployer for testing...");
    
    const mintTx = await messToken.mint(deployer.address, 10);
    await mintTx.wait();
    console.log("✅ Minted 10 tokens successfully!");

    const tokenBalance = await messToken.balanceOf(deployer.address, 1);
    console.log("🔢 Deployer token balance:", tokenBalance.toString());

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("📍 Network:", (await hre.ethers.provider.getNetwork()).name);
    console.log("📋 MessToken Address:", messTokenAddress);
    console.log("👤 Owner Address:", deployer.address);
    console.log("=".repeat(50));

    // Instructions for next steps
    console.log("\n📝 NEXT STEPS:");
    console.log("1. Add the contract address to your .env file:");
    console.log(`   NEXT_PUBLIC_MESS_TOKEN_ADDRESS=${messTokenAddress}`);
    console.log("2. Update your Next.js app to interact with the deployed contract");
    console.log("3. Verify the contract on Polygonscan (if on testnet)");
    console.log("4. Fund the contract owner with tokens for student distribution\n");

  } catch (error) {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("💥 Fatal error in deployment script:");
  console.error(error);
  process.exitCode = 1;
});