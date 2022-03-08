import { CircuitValue, Field, prop, PublicKey, UInt64 } from "snarkyjs";
import { KeyedAccumulatorFactory } from "../lib/merkle_proof";
import { StringCircuitValue } from "../lib/utils/string";
import { fieldToHex } from "../snapp/util";
import { CipherText } from "./cipher_text";

export class AccountSecret extends CircuitValue {
    @prop name: Field;
    @prop balance: UInt64;
    @prop pwdHash: Field;
  
    constructor(
      name: Field, 
      balance: UInt64,
      pwdHash: Field,
      ) {
      super();
      this.name = name;
      this.balance = balance;
      this.pwdHash = pwdHash;
    }

    toFields(): Field[] {
        return [this.name, this.balance.value, this.pwdHash];
    }

    toString(): string {
      return "name: " + StringCircuitValue.fromField(this.name).toString() + ", balance: " + this.balance.toString() +
            ", pwdHash: " + fieldToHex(this.pwdHash);
    }
}

export class Account extends CircuitValue {
  @prop publicKey: PublicKey;
  @prop encryptedPriKey: CipherText;
  @prop accountSecret: CipherText;
  
  constructor(publicKey: PublicKey, priKey: CipherText, accountSecret: CipherText) {
    super();
    this.publicKey = publicKey;
    this.encryptedPriKey = priKey;
    this.accountSecret = accountSecret;
  }
}

const accountsDepth: number = 32;
const accounts = KeyedAccumulatorFactory<Field, Account>(accountsDepth);
export type Accounts = InstanceType<typeof accounts>;