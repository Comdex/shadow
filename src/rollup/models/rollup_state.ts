import { CircuitValue, Field, prop } from 'snarkyjs';

export class RollupState extends CircuitValue {
  @prop accountsCommitment: Field;
  @prop pendingRcTxRootsCommitment: Field;

  constructor(accountsCommitment: Field, pendingRcTxRootsCommitment: Field) {
    super();
    this.accountsCommitment = accountsCommitment;
    this.pendingRcTxRootsCommitment = pendingRcTxRootsCommitment;
  }
}
