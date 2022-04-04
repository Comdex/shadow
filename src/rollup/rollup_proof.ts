import { branch, proofSystem, ProofWithInput } from 'snarkyjs';
import { RollupStateTransition } from './models/rollup_state_transition';

@proofSystem
export class RollupProof extends ProofWithInput<RollupStateTransition> {
  @branch
  static merge(p1: RollupProof, p2: RollupProof): RollupProof {
    p1.publicInput.target.assertEquals(p2.publicInput.source);
    return new RollupProof(new RollupStateTransition(p1.publicInput.source, p2.publicInput.target));
  }
}
