import bs58check from "bs58check";

import ContractState from "./ContractState";
import NeoAccount from "../../NeoLine/NeoAccount";
import NeoLineN3Interface from "../../NeoLine/NeoLineN3Interface";

const reverseHexString = (hexString: string) =>
  hexString
    .match(/[a-fA-F0-9]{2}/g)
    ?.reverse()
    .join("");

const CONTRACT_HASH =
  "0x" + reverseHexString("bac8fe4db61f69bde42c85a880ebb31f1fcfd1ba");
const NO_OWNER = "AAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const PET_COUNT = 8;

const PetShopContract = {
  adopt: async (
    neoLine: NeoLineN3Interface,
    petId: number,
    account: NeoAccount
  ) => {
    //
    // TODO: Figure out why this doesn't work. See:
    //       https://github.com/NeoNEXT/neoline/issues/52
    //
    const result = await neoLine.invoke({
      scriptHash: CONTRACT_HASH,
      operation: "adoptPet",
      args: [{ type: "Integer", value: `${petId}` }],
      signers: [
        {
          account: bs58check.decode(account.address).toString("hex").substr(2),
          scopes: 1,
        },
      ],
    });
    console.log("adopttx result", result);
  },

  feed: async (
    neoLine: NeoLineN3Interface,
    petId: number,
    account: NeoAccount
  ) => {
    //
    // TODO: Figure out why this doesn't work. See:
    //       https://github.com/NeoNEXT/neoline/issues/52
    //

    const result = await neoLine.invoke({
      scriptHash: CONTRACT_HASH,
      operation: "feed",
      args: [{ type: "Integer", value: `${petId}` }],
      signers: [
        {
          account: bs58check.decode(account.address).toString("hex").substr(2),
          scopes: 1,
        },
      ],
    });
    console.log("feedtx result", result);
  },

  updateContractState: async (
    neoLine: NeoLineN3Interface,
    setContractState: (updatedState: ContractState) => void
  ) => {
    const updatedContractState: ContractState = { pets: [] };
    for (let petId = 0; petId < PET_COUNT; petId++) {
      const [ownerResult, lastFedResult, hungerResult] = await Promise.all([
        neoLine.invokeRead({
          scriptHash: CONTRACT_HASH,
          operation: "getPetOwner",
          args: [{ type: "Integer", value: `${petId}` }],
          signers: [],
        }),
        neoLine.invokeRead({
          scriptHash: CONTRACT_HASH,
          operation: "getLastFeedingTime",
          args: [{ type: "Integer", value: `${petId}` }],
          signers: [],
        }),
        neoLine.invokeRead({
          scriptHash: CONTRACT_HASH,
          operation: "isHungry",
          args: [{ type: "Integer", value: `${petId}` }],
          signers: [],
        }),
      ]);

      let owner: string | undefined = undefined;
      const ownerStack = ownerResult.stack[0]?.value;
      if (ownerStack === NO_OWNER) {
        owner = undefined;
      } else {
        owner = `${ownerStack}`;
      }

      const lastFedStack = lastFedResult.stack[0]?.value || "0";
      let lastFedTimestamp = parseInt(`${lastFedStack}`);
      if (isNaN(lastFedTimestamp)) {
        lastFedTimestamp = 0;
      }
      const lastFed = new Date(lastFedTimestamp * 1000);

      const isHungry = !!hungerResult.stack[0]?.value;

      updatedContractState.pets.push({ petId, isHungry, owner, lastFed });
    }
    setContractState(updatedContractState);
  },
};

export default PetShopContract;
