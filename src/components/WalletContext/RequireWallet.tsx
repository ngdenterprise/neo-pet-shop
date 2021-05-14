import React, { useEffect, useState } from "react";

import defaultWalletContext from "./defaultWalletContext";
import NeoLineN3Init from "../../NeoLine/NeoLineN3Init";
import RequireWalletInstallationInstructions from "./RequireWalletInstallationInstructions";
import RequireWalletSplashScreen from "./RequireWalletSplashScreen";
import updateContext from "./updateContext";
import WalletContext from "./WalletContext";

const SPLASH_SCREEN_DURATION_MS = 3000;

type Props = {
  children: any;
};

/**
 * This component will only render its children when the NeoLine
 * extension has ben detected.  Before the extension is detected,
 * it will display a message explaining how to install the extension.
 */
export default function RequireWallet({ children }: Props) {
  const [neoLineDetected, setNeoLineDetected] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [walletContextData, setWalletContextData] =
    useState(defaultWalletContext);

  useEffect(() => {
    window.addEventListener("NEOLine.NEO.EVENT.READY", async () => {
      setNeoLineDetected(true);
      const neoLine = await NeoLineN3Init();
      await updateContext(neoLine, walletContextData, setWalletContextData);
      window.addEventListener("NEOLine.NEO.EVENT.BLOCK_HEIGHT_CHANGED", () =>
        updateContext(neoLine, walletContextData, setWalletContextData)
      );
    });
  }, []);

  useEffect(() => {
    setTimeout(() => setShowSplashScreen(false), SPLASH_SCREEN_DURATION_MS);
  }, []);

  if (neoLineDetected) {
    return (
      <WalletContext.Provider value={walletContextData}>
        {children}
      </WalletContext.Provider>
    );
  } else if (showSplashScreen) {
    return <RequireWalletSplashScreen />;
  } else {
    return <RequireWalletInstallationInstructions />;
  }
}
