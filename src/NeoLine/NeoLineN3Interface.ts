/**
 * Decalares a TypeScript inteface for the NeoLine N3 API as described at:
 * https://neoline.io/dapi/N3.html
 */
interface NeoLineN3Interface {
  getBalance(params: { address: string; contracts: string[] }[]): {
    [address: string]: { contract: string; symbol: string; amount: string }[];
  };
}

export default NeoLineN3Interface;
