import { useAddress, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

const App = () => {
  // use the hooks thirdweb give us.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log('🖐️ address:', address);

  const editionDrop = useEditionDrop('0xb12F7fDa84d1358587238a28f9D00486B8c512f2');
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!address) return;
    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log('⭐ this user has a membership NFT!');
        } else {
          setHasClaimedNFT(false);
          console.log('😭 this user doest have a membership NFT.');
        }
      }

      catch(err) {
        setHasClaimedNFT(false);
        console.error('failed to get balance', err);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim('0', 1);
      console.log(`🌊 successfully minted! check it out on opensea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch(err) {
      setHasClaimedNFT(false);
      console.error('Failed to mint NFT', err);
    } finally {
      setIsClaiming(false);
    }
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to BDSMDAO</h1>
        <button className="btn-hero" onClick={connectWithMetamask}>
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🪢 DAO Member Page ✨</h1>
        <p>Congratulations on being a member!</p>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>Mint your free 🪢 BDSM Membership NFT ✨</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? 'Minting...' : 'Mint your NFT'}
      </button>
    </div>
  );
};

export default App;
