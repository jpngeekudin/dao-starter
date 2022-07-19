import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop('0xb12F7fDa84d1358587238a28f9D00486B8c512f2');
const token = sdk.getToken('0x2C1FE3fCB08D666A799781A36d1afc1B6e8ABd49');

(async () => {
  try {
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);
    if (walletAddresses.length === 0) {
      console.log('No NFT have been claimed yet, maybe get some friends to claim your free NFTs!');
      process.exit(0);
    }

    const airdropTargets = walletAddresses.map(address => {
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log('✅ going to airdrop', randomAmount, 'tokens to', address);
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount
      }
      return airdropTarget;
    });

    console.log('✈️ starting airdrop...');
    await token.transferBatch(airdropTargets);
    console.log('✅ success airdropped tokens to all holders!');
  }

  catch(err) {
    console.error('failed to airdrop tokens', err);
  }
})();