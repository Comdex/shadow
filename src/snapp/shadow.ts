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
} from 'snarkyjs';
import { KeyedDataStore } from '../lib/data_store/KeyedDataStore';
import { StringCircuitValue } from '../lib/utils/StringCircuitValue';
import {
  Account, AccountKeys, EncryptedAccount,
} from "./contract_type";
import { encryptByPubKey, getHash, getPubKeyFromWallet } from "../lib/utils/encrypt";
import { accStore } from "./mock";
import { Hash } from 'crypto';

export { Shadow };

class Shadow extends SmartContract {
  @state(Field) accCommitment = State<Field>();
  @state(Field) accKeysCommitment = State<Field>();
  @state(Field) pendingTxCommitment = State<Field>();
  @state(Field) finishedTxCommitment = State<Field>();
  @state(Field) nonceSetCommitment = State<Field>();


  deploy(
    initialBalance: UInt64, 
    accCommitment: Field,
    accKeysCommitment: Field,
    pendingTxCommitment: Field,
    finishedTxCommitment: Field,
    nonceSetCommitment: Field
    ) {
    super.deploy();
    this.balance.addInPlace(initialBalance);
    this.accCommitment.set(accCommitment);
    this.accKeysCommitment.set(accKeysCommitment);
    this.pendingTxCommitment.set(pendingTxCommitment);
    this.finishedTxCommitment.set(finishedTxCommitment);
    this.nonceSetCommitment.set(nonceSetCommitment);
  }

  @method async registered(name: StringCircuitValue, accKeysStore: KeyedDataStore<String, AccountKeys>): Promise<Bool> {
      const accKeysCommitment = await this.accKeysCommitment.get();

      let accKeyOptional = accKeysStore.get(getHash(name.toString()));
      let root = accKeysStore.getMerkleRoot();

      return accKeysCommitment.equals(root).and(accKeyOptional.isSome.equals(true));
  }

  @method async register(
    name: StringCircuitValue,
    pwd: StringCircuitValue,
    accKeysStore: KeyedDataStore<String, AccountKeys>,
    accStore: KeyedDataStore<String, EncryptedAccount>,
  ) {
      const isRegistered = await this.registered(name, accKeysStore);
      isRegistered.assertEquals(false);
      //generate account encrypt keypair
      const acPriKey = PrivateKey.random();
      const acPubKey = acPriKey.toPublicKey();

      //get extern wallet pubkey
      let walletPubKey = getPubKeyFromWallet();
      let priKeyData: Field[] = acPriKey.toFields();
      //encrypt the prikey to save
      let encryptedAcPriKey = encryptByPubKey(priKeyData, walletPubKey);
      let accountKeys = new AccountKeys(acPubKey, encryptedAcPriKey);

      accKeysStore.set(getHash(name.toString()), accountKeys);
      let root = accKeysStore.getMerkleRoot();
      this.accKeysCommitment.set(root);
      
      let pwdHash = Poseidon.hash(pwd.toFields());
      let newAccount = new Account(name.toField(), UInt64.fromNumber(0), pwdHash);
      let encryptedAccount = newAccount.encrypt(acPubKey);

      accStore.set(getHash(name.toString()), encryptedAccount);
      let accStoreRoot = accStore.getMerkleRoot();
      this.accCommitment.set(accStoreRoot);
  }
  
  @method async deposit() {

  }

  @method async withdraw() {

  }

  @method async transfer() {

  }


}
