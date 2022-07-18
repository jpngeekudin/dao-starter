import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from '@ethersproject/constants';

const editionDrop = sdk.getEditionDrop('0xb12F7fDa84d1358587238a28f9D00486B8c512f2');

(async () => {
  try {
    const claimConditions = [{
      startTime: new Date(),
      maxQuantity: 50_000,
      price: 0,
      quantityLimitPerTransaction: 1,
      waitInSeconds: MaxUint256,
    }];

    await editionDrop.claimConditions.set('0', claimConditions);
    console.log('✅ successfully set claim condition!');
  }

  catch(err) {
    console.error('📛 failed to set claim condition', err);
  }
})();