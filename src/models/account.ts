import { CircuitValue, Field, prop, PublicKey, UInt64, Encoding, Group, Poseidon } from 'snarkyjs';
import { fieldToHex } from '../lib/utils/encode';
import { CipherText } from './cipher_text';

export class AccountSecret extends CircuitValue {
  @prop name: Field[];
  @prop balance: UInt64;
  @prop pwdHash: Field;
  @prop secret: Field; //random number

  constructor(name: Field[], balance: UInt64, pwdHash: Field, secret: Field) {
    super();
    this.name = name;
    this.balance = balance;
    this.pwdHash = pwdHash;
    this.secret = secret;
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
