import {
  CircuitValue,
  Encoding,
  Field,
  prop,
  UInt64,
  Poseidon,
  arrayProp,
  UInt32,
  PublicKey,
  PrivateKey,
  Encryption,
  Group
} from 'snarkyjs';
import { TxCipherText } from './cipher_text';

export class ShieldTxReceiptSecret extends CircuitValue {
  @arrayProp(Field, 1) sender: Field[]; //only internal account name
  @arrayProp(Field, 1) internalReceiver: Field[];
  @prop externalReceiver: PublicKey;
  @prop amount: UInt64;
  @prop blinding: Field; //random number

  constructor(
    sender: Field[],
    internalReceiver: Field[],
    externalReceiver: PublicKey,
    amount: UInt64,
    blinding: Field
  ) {
    super();
    this.sender = sender;
    this.internalReceiver = internalReceiver;
    this.externalReceiver = externalReceiver;
    this.amount = amount;
    this.blinding = blinding;
  }

  static createInternalTxSecret(
    sender: Field[],
    internalReceiver: Field[],
    amount: UInt64,
    blinding: Field
  ): ShieldTxReceiptSecret {
    return new ShieldTxReceiptSecret(
      sender,
      internalReceiver,
      PublicKey.ofFields(Array(255).fill(Field.zero)),
      amount,
      blinding
    );
  }

  static createExternalTxSecret(
    sender: Field[],
    externalReceiver: PublicKey,
    amount: UInt64,
    blinding: Field
  ): ShieldTxReceiptSecret {
    return new ShieldTxReceiptSecret(sender, [Field.zero], externalReceiver, amount, blinding);
  }

  toString(): string {
    return (
      'sender: ' +
      Encoding.Bijective.Fp.toString(this.sender) +
      ', receiver: ' +
      Encoding.Bijective.Fp.toString(this.internalReceiver) +
      ', amount: ' +
      this.amount.toString()
    );
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }
}

export class ShieldTxReceipt extends CircuitValue {
  @prop nonce: UInt32;
  @prop secret: TxCipherText;
  @prop fee: UInt32; //charge fee

  constructor(n: UInt32, s: TxCipherText, f: UInt32) {
    super();
    this.nonce = n;
    this.secret = s;
    this.fee = f;
  }

  getShieldTxReceiptSecret(shieldPriKey: PrivateKey): ShieldTxReceiptSecret {
    let oriData = Encryption.decrypt(this.secret, shieldPriKey);
    return ShieldTxReceiptSecret.ofFields(oriData);
  }

  hash() {
    return Poseidon.hash(this.toFields());
  }

  static get zero(): ShieldTxReceipt {
    return new ShieldTxReceipt(
      UInt32.zero,
      new TxCipherText(Group.ofFields(Array(255).fill(Field.zero)), Array(8).fill(Field.zero)),
      UInt32.zero
    );
  }
}
