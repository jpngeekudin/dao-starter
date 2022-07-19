import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      name: 'BDSM DAO',
      voting_token_address: '0x2C1FE3fCB08D666A799781A36d1afc1B6e8ABd49',
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: 6570,
      voting_quorum_fraction: 0,
      proposal_token_threshold: 0
    });

    console.log('✅ success deploy vote contract, address:', voteContractAddress);
  }

  catch(err) {
    console.error('failed to deploy vote contract', err);
  }
})();