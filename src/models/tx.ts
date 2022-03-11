import { CircuitValue, Encoding, Field, prop, UInt64, Group, Poseidon } from 'snarkyjs';
import { fieldToHex } from '../snapp/util';
import { CipherText } from './cipher_text';

// senderType,receiverType: Field(0) for account name, Field(1) for wallet address
export class TxReceiptSecret extends CircuitValue {
  @prop sender: Field;
  @prop senderType: Field;
  @prop receiver: Field;
  @prop receiverType: Field;
  @prop amount: UInt64;
  @prop memo: Field[];

  constructor(
    sender: Field,
    senderType: Field,
    receiver: Field,
    receiverType: Field,
    amount: UInt64,
    memo: Field[]
  ) {
    super();
    this.sender = sender;
    this.senderType = senderType;
    this.receiver = receiver;
    this.receiverType = receiverType;
    this.amount = amount;
    this.memo = memo;
  }

  toFields(): Field[] {
    return [
      this.sender,
      this.senderType,
      this.receiver,
      this.receiverType,
      this.amount.value
    ].concat(this.memo);
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

  toFields(): Field[] {
    let fields: Field[] = [];
    for (let i = 0; i < this.txs.length; i++) {
      fields = fields
        .concat([this.txs[i].publicKey.x, this.txs[i].publicKey.y])
        .concat(this.txs[i].cipherText);
    }

    return fields;
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
