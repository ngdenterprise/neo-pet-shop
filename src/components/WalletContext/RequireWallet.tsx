import React, { useEffect, useState } from "react";

import ContractState from "./ContractState";
import NeoLineN3Init from "../../NeoLine/NeoLineN3Init";
import PetShop from "../PetShop/PetShop";
import RequireWalletInstallationInstructions from "./RequireWalletInstallationInstructions";
import RequireWalletSplashScreen from "./RequireWalletSplashScreen";
import updateContext from "./updateContext";

const SPLASH_SCREEN_DURATION_MS = 3000;

/**
 * This component will only render its children when the NeoLine
 * extension has ben detected.  Before the extension is detected,
 * it will display a message explaining how to install the extension.
 */
export default function RequireWallet() {
  const [neoLineDetected, setNeoLineDetected] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [contractState, setContractState] = useState<ContractState>({
    pets: [],
  });

  useEffect(() => {
    window.addEventListener("NEOLine.NEO.EVENT.READY", async () => {
      setNeoLineDetected(true);
      const neoLine = await NeoLineN3Init();
      await updateContext(neoLine, setContractState);
      window.addEventListener("NEOLine.NEO.EVENT.BLOCK_HEIGHT_CHANGED", () =>
        updateContext(neoLine, setContractState)
      );
    });
  }, []);

  useEffect(() => {
    setTimeout(() => setShowSplashScreen(false), SPLASH_SCREEN_DURATION_MS);
  }, []);

  if (neoLineDetected) {
    return <PetShop contractState={contractState} />;
  } else if (showSplashScreen) {
    return <RequireWalletSplashScreen />;
  } else {
    return <RequireWalletInstallationInstructions />;
  }
}
