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
import { StringCircuitValue } from '../lib/utils/StringCircuitValue';
import {
  Account, AccountKeys, EncryptedAccount, TxReciptPool,
} from "./contract_type";
import { encryptByPubKey, hash, getPubKeyFromWallet } from "../lib/utils/encrypt";
import { accStore } from "./mock";
import { Hash } from 'crypto';
import { resolve } from 'path/posix';

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

  @method async registered(name: StringCircuitValue, accKeysStore: KeyedDataStore<Field, AccountKeys>): Promise<Bool> {
      const accKeysCommitment = await this.accKeysCommitment.get();

      let accKeyOptional = accKeysStore.get(name.hash());
      let root = accKeysStore.getMerkleRoot();

      return accKeysCommitment.equals(root).and(accKeyOptional.isSome.equals(true));
  }

  @method async register(
    name: StringCircuitValue,
    pwd: StringCircuitValue,
    accKeysStore: KeyedDataStore<Field, AccountKeys>,
    accStore: KeyedDataStore<Field, EncryptedAccount>,
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

      accKeysStore.set(name.hash(), accountKeys);
      let root = accKeysStore.getMerkleRoot();
      this.accKeysCommitment.set(root);

      let pwdHash = Poseidon.hash(pwd.toFields());
      let newAccount = new Account(name.toField(), UInt64.fromNumber(0), pwdHash);
      let encryptedAccount = newAccount.encrypt(acPubKey);

      accStore.set(name.hash(), encryptedAccount);
      let accStoreRoot = accStore.getMerkleRoot();
      this.accCommitment.set(accStoreRoot);
  }

  @method async fund(
    name: StringCircuitValue,
    amount: UInt64,
    acPriKey: PrivateKey,
    accKeysStore: KeyedDataStore<Field, AccountKeys>,
    accStore: KeyedDataStore<Field, EncryptedAccount>,
    pendingTxStore: KeyedDataStore<Field, TxReciptPool>,
    finishedTxStore: KeyedDataStore<Field, TxReciptPool>,
  ) {
    const isRegistered = await this.registered(name, accKeysStore);
    isRegistered.assertEquals(false);

    let nameHash = name.hash();

    // let pendinngTxRoot = pendingTxStore.getMerkleRoot();
    // const pendingTxCommitment = await this.pendingTxCommitment.get();
    // pendinngTxRoot.assertEquals(pendingTxCommitment);

    // let finishedTxRoot = finishedTxStore.getMerkleRoot();
    // const finishedTxCommitment = await this.finishedTxCommitment.get();
    // finishedTxCommitment.assertEquals(finishedTxRoot);

    let pendingTxPoolOption = pendingTxStore.get(nameHash);
    let pendingTxPool = pendingTxPoolOption.value;
    let isPoolEmpty = (pendingTxPool!=undefined) && pendingTxPool.isEmpty().toBoolean();

    let changeAmount: Int64 = Circuit.if(pendingTxPoolOption.isSome.and(new Bool(isPoolEmpty).not()),
                          pendingTxPool?.rollOver(name.hash(), acPriKey), Int64.zero);

    let encryptedAccount = accStore.get(nameHash);
    encryptedAccount.isSome.assertEquals(true);

    let account = encryptedAccount.value?.decrypt(acPriKey);

    // let lastBalance =

  }

  @method async withdraw() {

  }

  @method async transfer() {

  }


}
