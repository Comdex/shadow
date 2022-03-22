import { KeyedMerkleStore } from '@/lib/data_store/keyed_data_store';
import { Bool, CircuitValue, Field } from 'snarkyjs';
import { Account } from './account';
import { TxReciptPool } from './tx';

export type AccountDb = KeyedMerkleStore<string, Account>;
export type PendingTxDb = KeyedMerkleStore<string, TxReciptPool>;

class WrapBool extends CircuitValue {
  v: Bool;

  constructor(v: Bool) {
    super();
    this.v = v;
  }
}
export type NullifierHashesDb = KeyedMerkleStore<string, WrapBool>;
