import TypedValue from "./TypedValue";

type InvokeReadArgs = {
  scriptHash: string;
  operation: string;
  args: TypedValue[];
};

export default InvokeReadArgs;
