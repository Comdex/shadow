import { useTabsList } from '@mui/material';
import {
  Field,
  PrivateKey,
  PublicKey,
  SmartContract,
  state,
  State,
  method,
  UInt64,
  Party,
  Poseidon,
  UInt32,
  Bool,
  Circuit,
  Int64,
} from 'snarkyjs';
import { KeyedDataStore } from '../lib/data_store/KeyedDataStore';
import { StringCircuitValue } from '../lib/utils/string';
import { encryptByPubKey, hash, getPubKeyFromWallet } from "../lib/utils/encrypt";
import { accStore } from "./mock";
import { Hash } from 'crypto';
import { resolve } from 'path/posix';
import { Accounts, AccountSecret, Account } from '../models/account';

export { Shadow };

class Shadow extends SmartContract {
  @state(Field) accountsCommitment = State<Field>();
  @state(Field) pendingTxsCommitment = State<Field>();
  @state(Field) finishedTxsCommitment = State<Field>();
  @state(Field) nonceSetCommitment = State<Field>();


  deploy(
    initialBalance: UInt64, 
    accountsCommitment: Field,
    pendingTxsCommitment: Field,
    finishedTxsCommitment: Field,
    nonceSetCommitment: Field
    ) {
    super.deploy();
    this.balance.addInPlace(initialBalance);
    this.accountsCommitment.set(accountsCommitment);
    this.pendingTxsCommitment.set(pendingTxsCommitment);
    this.finishedTxsCommitment.set(finishedTxsCommitment);
    this.nonceSetCommitment.set(nonceSetCommitment);
  }

  @method async registered(name: StringCircuitValue, accounts: Accounts): Promise<Bool> {
      const accountsCommitment = await this.accountsCommitment.get();

      let nameHash = name.hash();
      let [account, accountProof] = accounts.get(nameHash);

      return Circuit.if(account.isSome, accountProof.verify(accountsCommitment, account.value), new Bool(false));
  }

  @method async register(
    name: StringCircuitValue,
    pwd: StringCircuitValue,
    accounts: Accounts
  ) {
      const isRegistered = await this.registered(name, accounts);
      isRegistered.assertEquals(false);
      //generate account encrypt keypair
      const acPriKey = PrivateKey.random();
      const acPubKey = acPriKey.toPublicKey();

      //get extern wallet pubkey
      let walletPubKey = getPubKeyFromWallet();
      let priKeyData: Field[] = acPriKey.toFields();
      //encrypt the prikey to save
      let encryptedAcPriKey = encryptByPubKey(priKeyData, walletPubKey);

      let accountSecret = new AccountSecret(name.toField(), UInt64.zero, pwd.hash());
      let encryptedAccountSecret = encryptByPubKey(accountSecret.toFields(), acPubKey);
      let account = new Account(acPubKey, encryptedAcPriKey, encryptedAccountSecret);

      let [_, accountProof] = accounts.get(name.hash());
      accounts.set(accountProof, account);
      let accountsNewRoot = accounts.commitment();
      this.accountsCommitment.set(accountsNewRoot);
  }
  
}
