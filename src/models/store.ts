import { KeyedMerkleStore } from '@/lib/data_store/keyed_data_store';
import { Bool, CircuitValue, Field } from 'snarkyjs';
import { Account } from './account';
import { ShieldTxReceipt, TxReciptPool } from './tx';

export type AccountDb = KeyedMerkleStore<string, Account>;

class WrapField extends CircuitValue {
  v: Field;

  constructor(v: Field) {
    super();
    this.v = v;
  }
}
export type PendingRcTxRootDb = KeyedMerkleStore<string, WrapField>;

export type PendingRcTxDb = KeyedMerkleStore<string, ShieldTxReceipt>;
export var userSubTreesMap = new Map<string, PendingRcTxDb>();
