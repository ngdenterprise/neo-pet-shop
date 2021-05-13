import React, { useEffect, useState } from "react";

import defaultWalletContext from "./defaultWalletContext";
import RequireWalletInstallationInstructions from "./RequireWalletInstallationInstructions";
import RequireWalletSplashScreen from "./RequireWalletSplashScreen";
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
  const [walletContext, setWalletContext] = useState(defaultWalletContext);

  useEffect(() => {
    window.addEventListener("NEOLine.NEO.EVENT.READY", () => {
      setNeoLineDetected(true);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => setShowSplashScreen(false), SPLASH_SCREEN_DURATION_MS);
  }, []);

  useEffect(() => {
    setInterval(() => setWalletContext({ helloWorld: "" + new Date() }), 1000);
  }, []);

  if (neoLineDetected) {
    return (
      <WalletContext.Provider value={walletContext}>
        {children}
      </WalletContext.Provider>
    );
  } else if (showSplashScreen) {
    return <RequireWalletSplashScreen />;
  } else {
    return <RequireWalletInstallationInstructions />;
  }
}
