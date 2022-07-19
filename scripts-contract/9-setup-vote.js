import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote('0x3eCCBDf2DBb8aE25A0aD8ECaC52DfAb6261F6031');
const token = sdk.getToken('0x2C1FE3fCB08D666A799781A36d1afc1B6e8ABd49');

(async () => {
  try {
    await token.roles.grant('minter', vote.getAddress());
    console.log('✅ success gave vote contract permissions to act on token contract');
  }

  catch(err) {
    console.error('failed to grant vote contract permissions on token contract', err);
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

    // grab 90% of the supply that we hold
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;
    await token.transfer(vote.getAddress(), percent90);
    console.log('✅ success transfering', percent90, 'tokens to vote contract');
  }

  catch(err) {
    console.error('failed to transfer tokens to vote contract', err);
  }
})();