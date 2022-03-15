import { CircuitValue, Encoding, Field, prop, UInt64, Group, Poseidon, arrayProp } from 'snarkyjs';
import { fieldToHex } from '../snapp/util';
import { CipherText } from './cipher_text';

// senderType,receiverType: Field(0) for account name, Field(1) for wallet address
export class TxReceiptSecret extends CircuitValue {
  @prop sender: Field;
  @prop senderType: Field;
  @prop receiver: Field;
  @prop receiverType: Field;
  @prop amount: UInt64;
  @prop secret: Field; //random number
  @prop memo: Field[]; // dynamic?

  constructor(
    sender: Field,
    senderType: Field,
    receiver: Field,
    receiverType: Field,
    amount: UInt64,
    secret: Field,
    memo: Field[]
  ) {
    super();
    this.sender = sender;
    this.senderType = senderType;
    this.receiver = receiver;
    this.receiverType = receiverType;
    this.amount = amount;
    this.secret = secret;
    this.memo = memo;
  }

  toString(): string {
    return (
      'sender: ' +
      fieldToHex(this.sender) +
      ', receiver: ' +
      fieldToHex(this.senderType) +
      ', amount: ' +
      this.amount.toString() +
      ', memo: ' +
      Encoding.Bijective.Fp.toString(this.memo)
    );
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }
}

export class TxReciptPool extends CircuitValue {
  @prop txs: CipherText[];

  constructor(txs: CipherText[]) {
    super();
    this.txs = txs;
  }

  static get zero(): TxReciptPool {
    return new TxReciptPool([]);
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
