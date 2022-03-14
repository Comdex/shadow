import { Bool, CircuitValue, Field, Optional, Poseidon } from 'snarkyjs';
import { MerkleTree } from '../merkle_proof/merkle_tree';

export class MerkleStack<V extends CircuitValue> {
  dataStore: Array<V>;
  merkleTree: MerkleTree;
  defaultValue: V;

  constructor(defaultValue: V) {
    this.dataStore = new Array<V>();
    this.merkleTree = new MerkleTree();
    this.defaultValue = defaultValue;
  }

  pop(): Optional<V> {
    let leaves = this.merkleTree.tree.leaves;
    let poppedElement = this.dataStore.pop();
    leaves.pop();
    this.merkleTree.clear();
    this.merkleTree.addLeaves(leaves, false);

    return new Optional(
      new Bool(poppedElement !== undefined),
      poppedElement || this.defaultValue
    );
  }

  push(value: V): number {
    this.merkleTree.addLeaves([Poseidon.hash(value.toFields())], false);

    return this.dataStore.push(value);
  }

  size(): number {
    return this.dataStore.length;
  }

  get(index: number): Optional<V> {
    return new Optional(
      new Bool(this.dataStore[index] !== undefined),
      this.dataStore[index] || this.defaultValue
    );
  }

  // shift() {}

  // unshift() {}

  splice(start: number, deleteCount?: number | undefined) {
    this.merkleTree.tree.leaves.splice(start, deleteCount);
    this.merkleTree.makeTree();
    return this.dataStore.splice(start, deleteCount);
  }

  // forEach(callback: (v: V, index: number, array: V[]) => void) {
  //   this.dataStore.forEach(callback);

  //   // TODO: update merkle tree just in case
  // }

  getMerkleRoot(): Field {
    return this.merkleTree.getMerkleRoot();
  }
}

