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
import { accStore } from "./mock";

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

      let accKeyOptional = accKeysStore.get(name.toString());
      let root = accKeysStore.getMerkleRoot();

      return accKeysCommitment.equals(root).and(accKeyOptional.isSome.equals(true));
  }

  @method async register(
    name: StringCircuitValue,
    pubKey: PublicKey,
    priKey: PrivateKey,
    accKeysStore: KeyedDataStore<String, AccountKeys>,
    accStore: KeyedDataStore<String, EncryptedAccount>,
  ) {
      const isRegistered = await this.registered(name, accKeysStore);
      isRegistered.assertEquals(false);
  }
  
  @method async deposit() {

  }

  @method async withdraw() {

  }

  @method async transfer() {
    
  }

}
