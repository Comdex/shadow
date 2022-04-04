/* eslint-disable max-params */
import {
  CircuitValue,
  Field,
  prop,
  PublicKey,
  UInt64,
  Encoding,
  Group,
  Poseidon,
  arrayProp,
  UInt32,
  PrivateKey,
  Encryption
} from 'snarkyjs';
import { fieldToHex } from '@/lib/utils/encode';
import { AccountCipherText, PrivateKeyCipherText } from './cipher_text';

export class AccountSecret extends CircuitValue {
  @arrayProp(Field, 1) name: Field[]; // max fields: 1
  @prop balance: UInt64;
  @prop pwdHash: Field;
  @prop blinding: Field; // random number

  constructor(name: Field[], balance: UInt64, pwdHash: Field, blinding: Field) {
    super();
    this.name = name;
    this.balance = balance;
    this.pwdHash = pwdHash;
    this.blinding = blinding;
  }

  encrypt(shieldPubKey: PublicKey): AccountCipherText {
    let cipherText = Encryption.encrypt(this.toFields(), shieldPubKey);
    return new AccountCipherText(cipherText.publicKey, cipherText.cipherText);
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
  @prop nameHash: Field;
  @prop nonce: UInt32;
  @prop shieldPubKey: PublicKey;
  @prop encryptedShieldPriKey: PrivateKeyCipherText;
  @prop secret: AccountCipherText;

  constructor(
    nameHash: Field,
    nonce: UInt32,
    shieldPubKey: PublicKey,
    encryptedShieldPriKey: PrivateKeyCipherText,
    secret: AccountCipherText
  ) {
    super();
    this.nameHash = nameHash;
    this.nonce = nonce;
    this.shieldPubKey = shieldPubKey;
    this.encryptedShieldPriKey = encryptedShieldPriKey;
    this.secret = secret;
  }

  getAccountSecret(shieldPriKey: PrivateKey): AccountSecret {
    let oriData = Encryption.decrypt(this.secret, shieldPriKey);
    return AccountSecret.ofFields(oriData);
  }

  getShieldPriKey(walletPriKey: PrivateKey): PrivateKey {
    let oriData = Encryption.decrypt(this.encryptedShieldPriKey, walletPriKey);
    return PrivateKey.ofFields(oriData);
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }

  static get zero(): Account {
    return new Account(
      Field.zero,
      UInt32.zero,
      PublicKey.ofFields(Array(255).fill(Field.zero)),
      new PrivateKeyCipherText(
        Group.ofFields(Array(255).fill(Field.zero)),
        Array(257).fill(Field.zero)
      ),
      new AccountCipherText(Group.ofFields(Array(255).fill(Field.zero)), Array(6).fill(Field.zero))
    );
  }
}
