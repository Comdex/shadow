import { KeyedMerkleStore } from '@/lib/data_store/keyed_data_store';
import { TxReciptPool } from '@/snapp/contract_type';
import { Account } from './account';

export type AccountDb = KeyedMerkleStore<string, Account>;
export type PendingTxDb = KeyedMerkleStore<string, TxReciptPool>;
export type FinishedTxDb = KeyedMerkleStore<string, TxReciptPool>;
