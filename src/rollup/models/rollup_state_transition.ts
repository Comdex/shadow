import { CircuitValue, Field, prop } from 'snarkyjs';
import { RollupState } from './rollup_state';

export class RollupStateTransition extends CircuitValue {
  @prop source: RollupState;
  @prop target: RollupState;

  constructor(s: RollupState, t: RollupState) {
    super();
    this.source = s;
    this.target = t;
  }
}
