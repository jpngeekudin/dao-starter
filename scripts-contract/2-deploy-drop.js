import sdk from "./1-initialize-sdk.js";
import { readFileSync } from 'fs';
import { AddressZero } from '@ethersproject/constants';

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: 'BDSMDAO Membership',
      description: 'Membership Pass for number 1 BDSM Lover DAO!',
      image: readFileSync('scripts/assets/holy_whip.png'),
      primary_sale_recipient: AddressZero,
    });

    const editionDrop = sdk.getEditionDrop(editionDropAddress);
    const metadata = await editionDrop.metadata.get();

    console.log('✅ success deploy edition drop! address:', editionDropAddress);
    console.log('✅ edition drop metadata:', metadata);
  }

  catch(err) {
    console.error('failed to deploy edition drop contract', err);
  }
})()