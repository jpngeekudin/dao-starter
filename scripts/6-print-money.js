import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken('0x2C1FE3fCB08D666A799781A36d1afc1B6e8ABd49');

(async () => {
  try {
    const amount = 1_000_000;
    await token.mintToSelf(amount);
    const totalSupply = await token.totalSupply();
    console.log('✅ there now is', totalSupply.displayValue, '$SADIST in circulation');
  }

  catch(err) {
    console.error('failed to print money', err);
  }
})();