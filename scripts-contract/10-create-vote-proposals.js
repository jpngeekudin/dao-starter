import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote('0x3eCCBDf2DBb8aE25A0aD8ECaC52DfAb6261F6031');
const token = sdk.getToken('0x2C1FE3fCB08D666A799781A36d1afc1B6e8ABd49');

(async () => {
  try {
    const amount = 420_000;
    const description = 'Should the DAO mint and additional ' + amount + ' tokens into the treasury?';
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          'mintTo', [
            vote.getAddress(),
            ethers.utils.parseUnits(amount.toString(), 18)
          ]
        )
      }
    ];
    
    await vote.propose(description, executions);
    console.log('✅ success created proposal to mint tokens');
  }

  catch(err) {
    console.error('failed to create first proposal', err);
  }

  try {
    const amount = 6900;
    const description = 'Should the DAO transfer ' + amount + ' tokens from the treasury to ' + process.env.WALLET_ADDRESS + ' for being awesome?';
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          'transfer', [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18)
          ]
        )
      }
    ];

    await vote.propose(description, executions);
    console.log('✅ success created proposal to reward ourselves from the treasury');
  }

  catch(err) {
    console.error('failed to create second proposal', err);
  }
})();