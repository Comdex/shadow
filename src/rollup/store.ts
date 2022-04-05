import { KeyedMerkleStore } from '@/lib/data_store/keyed_data_store';
import { Bool, CircuitValue, Field, prop } from 'snarkyjs';
import { Account } from '../models/account';
import { ShieldTxReceipt } from '../models/tx';

export type AccountDb = KeyedMerkleStore<string, Account>;

export class WrapField extends CircuitValue {
  @prop v: Field;

  constructor(v: Field) {
    super();
    this.v = v;
  }

  static get zero(): WrapField {
    return new WrapField(Field.zero);
  }
}
export type PendingRcTxRootDb = KeyedMerkleStore<string, WrapField>;
export type RcTxDb = KeyedMerkleStore<string, ShieldTxReceipt>;

export class AppState {
  accountDb: AccountDb;
  pendingRcTxRootDb: PendingRcTxRootDb;
  allUserRcTxDb: Map<string, RcTxDb>;
  accountsCommitmentOnChain: Field;
  pendingRcTxRootsCommitmentOnChain: Field;

  // eslint-disable-next-line max-params
  constructor(
    a: AccountDb,
    prc: PendingRcTxRootDb,
    all: Map<string, RcTxDb>,
    accountsCommitmentOnChain: Field,
    pendingRcTxRootsCommitmentOnChain: Field
  ) {
    this.accountDb = a;
    this.pendingRcTxRootDb = prc;
    this.allUserRcTxDb = all;
    this.accountsCommitmentOnChain = accountsCommitmentOnChain;
    this.pendingRcTxRootsCommitmentOnChain = pendingRcTxRootsCommitmentOnChain;
  }
}

export function initState(): AppState {
  let accountDb = new KeyedMerkleStore<string, Account>(Account.zero);
  let pendingRcTxRootDb = new KeyedMerkleStore<string, WrapField>(WrapField.zero);
  let allUserRcTxDb = new Map<string, RcTxDb>();

  // TODO
  let accountsCommitmentOnChain = Field.zero;
  let pendingRcTxRootsCommitmentOnChain = Field.zero;

  let state = new AppState(
    accountDb,
    pendingRcTxRootDb,
    allUserRcTxDb,
    accountsCommitmentOnChain,
    pendingRcTxRootsCommitmentOnChain
  );
  return state;
}
