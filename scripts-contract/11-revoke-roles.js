import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken('0x2C1FE3fCB08D666A799781A36d1afc1B6e8ABd49');

(async () => {
  try {
    const allRoles = await token.roles.getAll();
    console.log('👀 roles that exist right now:', allRoles);
  
    await token.roles.setAll({ admin: [], minter: [] });
    console.log('🎉 roles after revoking ourself', await token.roles.getAll());
    console.log('✅ success revoked our superpowers from the ERC-20 contract');
  }

  catch(err) {
    console.error('failed to revoke ourselves from the DAO treasury', err);
  }
})()