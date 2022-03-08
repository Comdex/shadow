import {
    Optional,
    Field,
    Bool,
    UInt64,
    Poseidon,
} from "snarkyjs";
import { DataStack } from "../lib/data_store/DataStack";
import { KeyedDataStore } from "../lib/data_store/KeyedDataStore";
import { StringCircuitValue } from "../lib/utils/StringCircuitValue";

import { Account, AccountKeys, EncryptedAccount, TxReciptPool, } from "./contract_type";
import { fieldToHex } from "./util";

let accStore = new KeyedDataStore<Field, EncryptedAccount>();


let accKeysStore = new KeyedDataStore<Field, AccountKeys>();


let pendingTxStore = new KeyedDataStore<Field, TxReciptPool>();


let finishedTxStore = new KeyedDataStore<Field, TxReciptPool>();


let nonceSetStore = new DataStack();






function checkProof(proof: Field, root: Field, value: Account): Bool {
    return proof.equals(root);
}

class AccountDb {
    data: Map<string, Account>;
  
    constructor() {
      this.data = new Map<string, Account>();
    }
  
    set(proof: Field, account: Account) {
      this.data.set(fieldToHex(account.name), account);
      console.log("set account success");
    }
  
    get(name: Field): [Optional<Account>, Field] {
      let acc = this.data.get(fieldToHex(name));
      console.log("get account: ", acc?.toString());
      if(acc) {
        
        let newAcc = new Account(acc.name, acc.balance, acc.withDrawKeyHash, acc.authKeyHash, acc.ownerMailHash);
        return [new Optional(new Bool(true), newAcc), Poseidon.hash(new Field(this.data.size).toFields())];
      } else {

        let newAcc = new Account(Field.zero, UInt64.zero, Field.zero, Field.zero, Field.zero);
        return [new Optional(new Bool(false), newAcc), Poseidon.hash(new Field(this.data.size).toFields())];
      }
    }
  
    commitment() {
      return Poseidon.hash(new Field(this.data.size).toFields());
    }

    print() {
      console.log("print db start");
      this.data.forEach((v) => {
        console.log(v.toString());
      });
      console.log("print db end");
    }
  }



  export { accStore, accKeysStore, pendingTxStore, finishedTxStore, nonceSetStore };