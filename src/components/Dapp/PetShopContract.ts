import ContractState from "./ContractState";
import NeoAccount from "../../NeoLine/NeoAccount";
import NeoLineN3Interface from "../../NeoLine/NeoLineN3Interface";

const CONTRACT_HASH = "0x11a57cc4da0c0020e8deb18092ed0b6c2e106b59";
const NO_OWNER = "AAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const PET_COUNT = 16;

const PetShopContract = {
  adopt: async (
    neoLine: NeoLineN3Interface,
    petId: number,
    account: NeoAccount
  ) => {},

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
