import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const editionDrop = sdk.getEditionDrop('0xb12F7fDa84d1358587238a28f9D00486B8c512f2');

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: 'Holy Whip',
        description: 'An Holy Whip dropped from Eden, used to access the holy BDSMDAO.',
        image: readFileSync('scripts/assets/holy_whip.png'),
      }
    ]);
    console.log('✅ successfully created a new NFT in the drop!');
  }

  catch(err) {
    console.log('📛 failed to create the new NFT', err);
  }
})();