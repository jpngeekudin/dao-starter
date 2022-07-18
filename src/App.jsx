import { useAddress, useToken, useVote, useNetwork, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { AddressZero } from '@ethersproject/constants';
import { useEffect, useMemo, useState } from "react";

// update push
const App = () => {
  // use the hooks thirdweb give us.
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log('🖐️ address:', address);

  const editionDrop = useEditionDrop('0xb12F7fDa84d1358587238a28f9D00486B8c512f2');
  const token = useToken('0x2C1FE3fCB08D666A799781A36d1afc1B6e8ABd49');
  const vote = useVote('0x3eCCBDf2DBb8aE25A0aD8ECaC52DfAb6261F6031');

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4);
  };

  // get all proposal
  useEffect(() => {
    if (!hasClaimedNFT) return;

    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log('🌈 proposals:', proposals);
      } catch(err) {
        console.log('failed to get proposals', err);
      }
    }
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // check if user already voted
  useEffect(() => {
    if (!hasClaimedNFT) return;
    if (!proposals.length) return;

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) console.log('🥵 user has already voted');
        else console.log('😀 use has not voted yet');
      } catch(err) {
        console.error('failed to check if wallet has voted', err);
      }
    }
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);

  // get all nft holders
  useEffect(() => {
    if (!hasClaimedNFT) return;

    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log('🚀 members addresses', memberAddresses);
      } catch(err) {
        console.error('failed get member list', err);
      }
    }
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // get token amount each members have
  useEffect(() => {
    if (!hasClaimedNFT) return;

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log('👜 amounts', amounts);
      } catch(err) {
        console.error('failed get member balances', err);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

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

  const memberList = useMemo(() => {
    return memberAddresses.map(address => {
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);
      return { address, tokenAmount: member?.balance.displayValue || '0' };
    })
  }, [memberAddresses, memberTokenAmounts]);

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

  if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
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
        <h1>🪢 BDSM DAO 💞</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

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
