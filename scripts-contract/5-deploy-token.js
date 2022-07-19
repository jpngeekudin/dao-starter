import sdk from "./1-initialize-sdk.js";
import { AddressZero } from '@ethersproject/constants';

(async () => {
  try {
    const tokenAddress = await sdk.deployer.deployToken({
      name: 'BDSM Sadistic Token',
      symbol: 'SADIST',
      primary_sale_recipient: AddressZero
    });
    console.log('✅ successfully deployed token module, address:', tokenAddress);
  }

  catch(err) {
    console.error('failed to deploy token module', err);
  }
})();