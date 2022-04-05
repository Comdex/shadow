import { arrayProp, CircuitValue, Field, Group, prop } from 'snarkyjs';

export interface CipherText {
  publicKey: Group;
  cipherText: Field[];
}

export class TxCipherText extends CircuitValue {
  @prop publicKey: Group;
  @arrayProp(Field, 8) cipherText: Field[];

  constructor(publicKey: Group, cipherText: Field[]) {
    super();
    this.publicKey = publicKey;
    this.cipherText = cipherText;
  }
}

export class PrivateKeyCipherText extends CircuitValue {
  @prop publicKey: Group;
  @arrayProp(Field, 257) cipherText: Field[];

  constructor(publicKey: Group, cipherText: Field[]) {
    super();
    this.publicKey = publicKey;
    this.cipherText = cipherText;
  }
}

export class AccountCipherText extends CircuitValue {
  @prop publicKey: Group;
  @arrayProp(Field, 6) cipherText: Field[];

  constructor(publicKey: Group, cipherText: Field[]) {
    super();
    this.publicKey = publicKey;
    this.cipherText = cipherText;
  }
}
