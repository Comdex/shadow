import { CircuitValue, Field, prop, UInt64 } from "snarkyjs";
import { KeyedAccumulatorFactory } from "../lib/merkle_proof";
import { fieldToHex } from "../snapp/util";
import { CipherText } from "./cipher_text";



export class TxReceiptSecret extends CircuitValue {
    @prop fromNameHash: Field;
    @prop toNameHash: Field;
    @prop amount: UInt64;
    
    constructor(
      fromNameHash: Field,
      toNameHash: Field,
      amount: UInt64
    ) {
      super();
      this.fromNameHash = fromNameHash;
      this.toNameHash = toNameHash;
      this.amount = amount;
    }

    toFields(): Field[] {
        return [this.fromNameHash, this.toNameHash, this.amount.value];
    }

    toString(): string {
        return "fromNameHash: " + fieldToHex(this.fromNameHash) + ", toNameHash: " + fieldToHex(this.toNameHash) +
              ", amount: " + this.amount.toString();
    }
}

export class TxReciptPool extends CircuitValue {
    @prop txs: CipherText[];

    constructor(txs: CipherText[]) {
        super();
        this.txs = txs;
    }

}

const txIndexDepth: number = 32;
const pendingTxs = KeyedAccumulatorFactory<Field, TxReciptPool>(txIndexDepth);
const finishedTxs = KeyedAccumulatorFactory<Field, TxReciptPool>(txIndexDepth);
export type PendingTxs = InstanceType<typeof pendingTxs>;
export type FinishedTxs = InstanceType<typeof finishedTxs>;