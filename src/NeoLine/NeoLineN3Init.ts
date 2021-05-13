/**
 * Provides a mechanism to call NEOLineN3.Init(), a method injected to the browser
 * by the NeoLine wallet that allows construction of an object implementing
 * NeoLineN3Interface
 */

import NeoLineN3Interface from "./NeoLineN3Interface";

function NeoLineN3Init(): Promise<NeoLineN3Interface> {
  // Use an async pattern as the global NEOLineN3 is not available while
  // the NEOLine.NEO.EVENT.READY event is still firing:
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(new (window as any).NEOLineN3.Init());
    }, 10)
  );
}

export default NeoLineN3Init;
