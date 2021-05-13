import React from "react";

import CenterInScreen from "./components/CenterInScreen";
import PetShop from "./components/PetShop/PetShop";
import RequireWallet from "./components/RequireWallet/RequireWallet";

function PetShopApp() {
  return (
    <CenterInScreen>
      <RequireWallet>
        <PetShop />
      </RequireWallet>
    </CenterInScreen>
  );
}

export default PetShopApp;
