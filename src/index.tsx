import React from "react";
import ReactDOM from "react-dom";

import RequireWallet from "./components/WalletContext/RequireWallet";

ReactDOM.render(
  <React.StrictMode>
    <RequireWallet />
  </React.StrictMode>,
  document.getElementById("root")
);
