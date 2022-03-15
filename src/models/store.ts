import { KeyedMerkleStore } from '@/lib/data_store/keyed_data_store';
import { Account } from './account';
import { TxReciptPool } from './tx';

export type AccountDb = KeyedMerkleStore<string, Account>;
export type PendingTxDb = KeyedMerkleStore<string, TxReciptPool>;
export type FinishedTxDb = KeyedMerkleStore<string, TxReciptPool>;
