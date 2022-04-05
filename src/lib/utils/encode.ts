import { Field } from "snarkyjs";

export function fieldToHex(field: Field) {
    return BigInt(field.toString()).toString(16);
}


