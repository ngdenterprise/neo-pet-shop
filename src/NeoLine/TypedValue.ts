type NeoType = "Address" | "Boolean" | "Integer";

type TypedValue = { type: NeoType; value: string | boolean };

export default TypedValue;
