import React from "react";

import CenterInScreen from "../CenterInScreen";
import ContractState from "../WalletContext/ContractState";
import Pet from "./Pet";

type Props = {
  contractState: ContractState;
};

/**
 * Renders the main Pet Shop UI
 */
export default function PetShop({ contractState }: Props) {
  if (!contractState.pets.length) {
    return <div>Loading&hellip;</div>;
  }
  return (
    <CenterInScreen>
      <div
        style={{
          alignContent: "stretch",
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {contractState.pets.map((_) => (
          <Pet
            key={_.petId}
            isHungry={_.isHungry}
            lastFed={_.lastFed}
            petId={_.petId}
            owner={_.owner}
          />
        ))}
      </div>
    </CenterInScreen>
  );
}
