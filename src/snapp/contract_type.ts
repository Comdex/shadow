import {
    CircuitValue,
    prop,
    Signature,
    PublicKey,
    Field,
    UInt64,
    PrivateKey,
    Poseidon
} from "snarkyjs";

import { fieldToHex } from "./util";

class Account extends CircuitValue {
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

    toString(): string {
      return "name_hex: " + fieldToHex(this.name) + ", balance: " + this.balance.toString();
    }

    //TODO: mock
    encrypt(pubKey: PublicKey): EncryptedAccount {
      const res: Field[] = [];
      res.push(this.name);
      res.push(this.balance.value);
      res.push(this.pwdHash);
      return new EncryptedAccount(res);
    }  
  }

  class EncryptedAccount extends CircuitValue {
    @prop encryptedData: Field[];

    constructor(data: Field[]) {
      super();
      this.encryptedData = data;
    }

    //TODO: mock
    decrypt(priKey: PrivateKey): Account {
      let name = this.encryptedData[0];
      let balance = new UInt64(this.encryptedData[1]);
      let pwdHash = this.encryptedData[2];

      return new Account(name, balance, pwdHash);
    }
  }

  class AccountKeys extends CircuitValue {
    @prop publicKey: PublicKey;
    @prop encryptedPriKey: Field[];
    
    constructor(publicKey: PublicKey, priKey: Field[]) {
      super();
      this.publicKey = publicKey;
      this.encryptedPriKey = priKey;
    }
  }

  class TxReceipt extends CircuitValue {
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

    //TODO: mock
    encrypt(pubKey: PublicKey): EncryptedTxReceipt {
      const res: Field[] = [];
      res.push(this.fromNameHash);
      res.push(this.toNameHash);
      res.push(this.amount.value);
      return new EncryptedTxReceipt(res);
    }

    //TODO
    hash(): Field {
      const res: Field[] = [];
      res.push(this.fromNameHash);
      res.push(this.toNameHash);
      res.push(this.amount.value);
      return Poseidon.hash(res);
    }

  }

  class EncryptedTxReceipt extends CircuitValue {
    @prop encryptedData: Field[];

    constructor(data: Field[]) {
      super();
      this.encryptedData = data;
    }

    //TODO: mock
    decrypt(priKey: PrivateKey): TxReceipt {
      let fromNameHash = this.encryptedData[0];
      let toNameHash =this.encryptedData[1];
      let amount = new UInt64(this.encryptedData[2]);

      return new TxReceipt(fromNameHash, toNameHash, amount);
    }
  }

  class TxReciptPool extends CircuitValue {
    @prop txs: EncryptedTxReceipt[];

    constructor(txs: EncryptedTxReceipt[]) {
      super();
      this.txs = txs;
    }
  }



  export { Account, EncryptedAccount, AccountKeys, TxReceipt, EncryptedTxReceipt, TxReciptPool };