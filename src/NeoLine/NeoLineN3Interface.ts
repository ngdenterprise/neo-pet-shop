import InvokeReadArgs from "./InvokeReadArgs";
import TypedValue from "./TypedValue";

type GetBalanceArgs = { address: string; contracts: string[] };

/**
 * Decalares a TypeScript inteface for the NeoLine N3 API as described at:
 * https://neoline.io/dapi/N3.html
 */
interface NeoLineN3Interface {
  getAccount(): Promise<{ address: string; label: string }>;

  getBalance(params: GetBalanceArgs[]): Promise<{
    [address: string]: { contract: string; symbol: string; amount: string }[];
  }>;

  invokeRead(
    params: InvokeReadArgs & { signers: { account: string; scopes: number }[] }
  ): Promise<{ script: string; stack: TypedValue[]; state: string }>;

  // Note that the order of items in the result array is not consistent with
  // the order of the items in the input array.
  invokeReadMulti(params: {
    invokeReadArgs: InvokeReadArgs[];
    signers: { account: string; scopes: number }[];
  }): Promise<{ script: string; stack: TypedValue[]; state: string }[]>;
}

export default NeoLineN3Interface;
