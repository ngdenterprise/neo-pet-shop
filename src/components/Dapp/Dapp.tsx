import React, { useEffect, useState } from "react";

import ContractState from "./ContractState";
import InstallationInstructions from "./InstallationInstructions";
import NeoLineN3Init from "../../NeoLine/NeoLineN3Init";
import NeoLineN3Interface from "../../NeoLine/NeoLineN3Interface";
import PetShop from "../PetShop/PetShop";
import PetShopContract from "./PetShopContract";
import SplashScreen from "./SplashScreen";

const SPLASH_SCREEN_DURATION_MS = 3000;

/**
 * This component will only render its children when the NeoLine
 * extension has ben detected.  Before the extension is detected,
 * it will display a message explaining how to install the extension.
 */
export default function Dapp() {
  const [neoLine, setNeoLine] = useState<NeoLineN3Interface | null>(null);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [contractState, setContractState] = useState<ContractState>({
    pets: [],
  });

  useEffect(() => {
    window.addEventListener("NEOLine.NEO.EVENT.READY", async () => {
      const neoLine = await NeoLineN3Init();
      setNeoLine(neoLine);
      await PetShopContract.updateContractState(neoLine, setContractState);
      window.addEventListener("NEOLine.NEO.EVENT.BLOCK_HEIGHT_CHANGED", () =>
        PetShopContract.updateContractState(neoLine, setContractState)
      );
    });
  }, []);

  useEffect(() => {
    setTimeout(() => setShowSplashScreen(false), SPLASH_SCREEN_DURATION_MS);
  }, []);

  const adopt = async (petId: number) => {
    if (!neoLine) {
      return;
    }
    const account = await neoLine.getAccount();
    if (!account) {
      return;
    }
    await PetShopContract.adopt(neoLine, petId, account);
  };

  if (!!neoLine) {
    return <PetShop adopt={adopt} contractState={contractState} />;
  } else if (showSplashScreen) {
    return <SplashScreen />;
  } else {
    return <InstallationInstructions />;
  }
}
