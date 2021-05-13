import React, { useContext } from "react";

import WalletContext from "../WalletContext/WalletContext";

/**
 * Renders the main Pet Shop UI, expects to have access to a wallet context
 */
export default function PetShop() {
  const walletContextData = useContext(WalletContext);
  return <>The Neo Pet Shop is opening soon! {walletContextData.helloWorld}</>;
}
