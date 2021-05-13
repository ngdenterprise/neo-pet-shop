import NeoLineN3Interface from "../../NeoLine/NeoLineN3Interface";
import WalletContextData from "./WalletContextData";

async function updateContext(
  neoLine: NeoLineN3Interface,
  setContext: React.Dispatch<React.SetStateAction<WalletContextData>>
) {
  console.log("updating wallet context");
}

export default updateContext;
