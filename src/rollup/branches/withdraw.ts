import { TransferProof } from '@/zkapp/proof';
import { Field } from 'snarkyjs';
import { RollupState } from '../models/rollup_state';
import { RollupStateTransition } from '../models/rollup_state_transition';
import { RollupProof } from '../rollup_proof';
import { AccountDb, PendingRcTxRootDb, RcTxDb, WrapField } from '../store';

// eslint-disable-next-line max-params
export function withdraw(
  proofWithInput: TransferProof,
  accountDb: AccountDb,
  pendingTcTxRootDb: PendingRcTxRootDb,
  pendingRcTxDb: RcTxDb,
  accountsCommitmentOnchain: Field,
  pendingRcTxRootsCommitmentOnChain: Field
): RollupProof {
  let before = new RollupState(accountDb.getMerkleRoot(), pendingTcTxRootDb.getMerkleRoot());

  // proofWithInput.assertVerifies();

  let transferArgs = proofWithInput.publicInput;
  transferArgs.accountsCommitment.assertEquals(accountsCommitmentOnchain);
  transferArgs.pendingRcTxRootsCommitment.assertEquals(pendingRcTxRootsCommitmentOnChain);
  let account = transferArgs.finalAccount;
  let tx = transferArgs.newPendingTx;
  account.nonce.equals(tx.nonce).assertEquals(true);
  account.nonce = account.nonce.add(1);

  let nameHash = transferArgs.nameHash;
  accountDb.set(nameHash.toString(), account);
  pendingRcTxDb.set(tx.hash().toString(), tx);
  // for(let i=0; i<transferArgs.mergedPendingTxCommitments.length; i++) {
  // delete
  // }

  let subTreeRoot = pendingRcTxDb.getMerkleRoot();
  pendingTcTxRootDb.set(nameHash.toString(), new WrapField(subTreeRoot));

  let after = new RollupState(accountDb.getMerkleRoot(), pendingTcTxRootDb.getMerkleRoot());

  return new RollupProof(new RollupStateTransition(before, after));
}
