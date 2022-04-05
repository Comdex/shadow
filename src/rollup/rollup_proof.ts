import { branch, Field, proofSystem, ProofWithInput } from 'snarkyjs';
import { RollupStateTransition } from './models/rollup_state_transition';
import { TransferProof } from '../snapp/proof';
import { transfer } from './branches/transfer';
import { withdraw } from './branches/withdraw';
import { AccountDb, PendingRcTxRootDb, RcTxDb } from './store';

@proofSystem
export class RollupProof extends ProofWithInput<RollupStateTransition> {
  @branch
  static merge(p1: RollupProof, p2: RollupProof): RollupProof {
    p1.publicInput.target.assertEquals(p2.publicInput.source);
    return new RollupProof(new RollupStateTransition(p1.publicInput.source, p2.publicInput.target));
  }

  // eslint-disable-next-line max-params
  @branch static processTransfer(
    proofWithInput: TransferProof,
    accountDb: AccountDb,
    pendingTcTxRootDb: PendingRcTxRootDb,
    pendingRcTxDb: RcTxDb,
    accountsCommitmentOnchain: Field,
    pendingRcTxRootsCommitment: Field
  ): RollupProof {
    return transfer(
      proofWithInput,
      accountDb,
      pendingTcTxRootDb,
      pendingRcTxDb,
      accountsCommitmentOnchain,
      pendingRcTxRootsCommitment
    );
  }

  // eslint-disable-next-line max-params
  @branch static processWithDraw(
    proofWithInput: TransferProof,
    accountDb: AccountDb,
    pendingTcTxRootDb: PendingRcTxRootDb,
    pendingRcTxDb: RcTxDb,
    accountsCommitmentOnchain: Field,
    pendingRcTxRootsCommitment: Field
  ): RollupProof {
    return withdraw(
      proofWithInput,
      accountDb,
      pendingTcTxRootDb,
      pendingRcTxDb,
      accountsCommitmentOnchain,
      pendingRcTxRootsCommitment
    );
  }
}
