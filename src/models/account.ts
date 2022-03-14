import { CircuitValue, Field, prop, PublicKey, UInt64, Encoding, Group, Poseidon } from 'snarkyjs';
import { fieldToHex } from '../snapp/util';
import { CipherText } from './cipher_text';

export class AccountSecret extends CircuitValue {
  @prop name: Field[];
  @prop balance: UInt64;
  @prop pwdHash: Field;

  constructor(name: Field[], balance: UInt64, pwdHash: Field) {
    super();
    this.name = name;
    this.balance = balance;
    this.pwdHash = pwdHash;
  }

  toFields(): Field[] {
    return [this.balance.value, this.pwdHash].concat(this.name);
  }

  toString(): string {
    return (
      'name: ' +
      Encoding.Bijective.Fp.toString(this.name) +
      ', balance: ' +
      this.balance.toString() +
      ', pwdHash: ' +
      fieldToHex(this.pwdHash)
    );
  }
}

export class Account extends CircuitValue {
  @prop pubKey: PublicKey;
  @prop encryptedPriKey: CipherText;
  @prop accountSecret: CipherText;

  constructor(pubKey: PublicKey, priKey: CipherText, accountSecret: CipherText) {
    super();
    this.pubKey = pubKey;
    this.encryptedPriKey = priKey;
    this.accountSecret = accountSecret;
  }

  toFields(): Field[] {
    return this.pubKey
      .toFields()
      .concat(this.encryptedPriKey.cipherText)
      .concat(this.accountSecret.cipherText);
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }

  static get zero(): Account {
    return new Account(
      PublicKey.ofFields(Array(255).fill(Field.zero)),
      { publicKey: Group.ofFields(Array(255).fill(Field.zero)), cipherText: [] },
      { publicKey: Group.ofFields(Array(255).fill(Field.zero)), cipherText: [] }
    );
  }
}
