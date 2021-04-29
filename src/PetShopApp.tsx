import React from "react";

import CenterInScreen from "./components/CenterInScreen";

import RequireWallet from "./components/RequireWallet/RequireWallet";

function PetShopApp() {
  return (
    <CenterInScreen>
      <RequireWallet>The Neo Pet Shop is opening soon!</RequireWallet>
    </CenterInScreen>
  );
}

export default PetShopApp;
