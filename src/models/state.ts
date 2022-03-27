import { CircuitValue, prop, State } from 'snarkyjs';

export class StateTransition extends CircuitValue {
  @prop source: State;
  @prop target: State;
  constructor(source: State, target: State) {
    super();
    this.source = source;
    this.target = target;
  }
}
