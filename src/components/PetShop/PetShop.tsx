import React, { useContext } from "react";

import Pet from "./Pet";
import WalletContext from "../WalletContext/WalletContext";

/**
 * Renders the main Pet Shop UI, expects to have access to a wallet context
 */
export default function PetShop() {
  const walletContextData = useContext(WalletContext);
  if (!walletContextData.pets.length) {
    return <div>Loading&hellip;</div>;
  }
  return (
    <div
      style={{
        alignContent: "stretch",
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
      }}
    >
      {walletContextData.pets.map((_) => (
        <Pet
          key={_.petId}
          isHungry={_.isHungry}
          lastFed={_.lastFed}
          petId={_.petId}
          owner={_.owner}
        />
      ))}
    </div>
  );
}
