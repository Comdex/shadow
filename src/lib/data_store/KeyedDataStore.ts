import { Field, CircuitValue, Poseidon, Bool, Optional } from 'snarkyjs';

import { MerklePathElement, MerkleTree } from '../merkle_proof/MerkleTree';

export class KeyedDataStore<K, V extends CircuitValue> {

  dataStore: Map<K, V>;
  merkleTree: MerkleTree;

  constructor() {
    this.dataStore = new Map<K, V>();
    this.merkleTree = new MerkleTree();
  }

  /**
   * Creates a Merkle tree and data store from a map of data
   * @param {Map<K, V>} dataBlobs Map to create the KeyedDataStore from
   * @returns true if successful
   */
  fromData(dataBlobs: Map<K, V>): boolean {
    this.merkleTree = new MerkleTree();

    let leaves: Field[] = [];
    for (let [key, value] of dataBlobs.entries()) {
      leaves.push(Poseidon.hash(value.toFields()));
    }
    this.merkleTree.addLeaves(leaves, false);
    this.dataStore = dataBlobs;
    return true;
  }

  /**
   * Validates a Merkle path/proof
   * @param merklePath Merkle proof/path
   * @param targetHash hash of the target element
   * @param merkleRoot root of the merkle tree
   * @returns true if proof is valid
   */
  validateProof(
    merklePath: MerklePathElement[],
    targetHash: Field,
    merkleRoot: Field
  ): boolean {
    return MerkleTree.validateProof(merklePath, targetHash, merkleRoot);
  }

  /**
   * Gets the merkle root of the current structure
   * @returns Merkle root or undefined if not found
   */
  getMerkleRoot(): Field {
    return this.merkleTree.getMerkleRoot();
  }

  /**
   * Returns the proof corresponding to value at a given key
   * @param key Key of the element in the map
   * @returns Merkle path
   */
  getProofByKey(key: K): MerklePathElement[] {
    let value = this.dataStore.get(key);
    if (value === undefined) {
      return [];
    }

    return this.getProof(Poseidon.hash(value.toFields()));
  }

  /**
   * Gets a merkle proof corresponding to the value in the map
   * @param value Value in map
   * @returns Merkle path
   */
  getProofByValue(value: V): MerklePathElement[] {
    return this.getProof(Poseidon.hash(value.toFields()));
  }

  /**
   * Gets a value by its key
   * @param key
   * @returns value or undefined if not found
   */
  // get(key: K): V | undefined {
  //   return this.dataStore.get(key);
  // }
  
  get(key: K): Optional<V | undefined> {
    let data = this.dataStore.get(key);
    if(data) {
      return new Optional(new Bool(true), data);
    } else {
      return new Optional(new Bool(false), data);
    }
  }

  /**
   * Sets or adds a new value and key to the data store
   * @param key Key
   * @param value Value
   * @returns true if successful
   */
  set(key: K, value: V) {
    let entry: V | undefined = this.dataStore.get(key);
    if (entry === undefined) {
      // key is new
      this.merkleTree.addLeaves([Poseidon.hash(value.toFields())], false);
      this.dataStore.set(key, value);
    } else {
      // element already exists in merkle tree, just change the entry so the order doesnt get mixed up#
      let index = this.merkleTree.getIndex(Poseidon.hash(entry.toFields()));
      this.merkleTree.tree.leaves[index!] = Poseidon.hash(value.toFields());
      this.merkleTree.makeTree();
      this.dataStore.set(key, value);
    }
  }

  /**
   * Gets a proof by the values hash
   * @param hash hash of the value
   * @returns Merkle path
   */
  getProof(hash: Field): MerklePathElement[] {
    let index: number | undefined = this.merkleTree.getIndex(hash);
    if (index === undefined) {
      return [];
    }
    return this.merkleTree.getProof(index);
  }
}