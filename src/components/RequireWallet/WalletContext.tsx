import React from "react";

import defaultWalletContext from "./defaultWalletContext";
import WalletContextData from "./WalletContextData";

const WalletContext =
  React.createContext<WalletContextData>(defaultWalletContext);

export default WalletContext;
