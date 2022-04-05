import { CircuitValue, Field, prop } from 'snarkyjs';
import { RollupState } from './rollup_state';

export class RollupStateTransition extends CircuitValue {
  @prop source: RollupState;
  @prop target: RollupState;

  constructor(source: RollupState, target: RollupState) {
    super();
    this.source = source;
    this.target = target;
  }
}
