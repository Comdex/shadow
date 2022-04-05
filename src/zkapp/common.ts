import { MerkleTree } from '@/lib/merkle_proof/merkle_tree';
import { ShieldTxReceipt } from '@/models/tx';
import { Circuit, Field, Poseidon, PrivateKey, UInt64 } from 'snarkyjs';

export function getTxCommitments(pendingTxs: ShieldTxReceipt[]): Field[] {
  let txCommitments: Field[] = [];
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < pendingTxs.length; i++) {
    txCommitments.push(pendingTxs[i].hash());
  }

  if (txCommitments.length === 0) {
    return Array(10).fill(Field.zero);
  } else {
    return txCommitments;
  }
}

// eslint-disable-next-line max-params
export function mergeBalance(
  pendingTxs: ShieldTxReceipt[], // max 10
  pendingTxMerkleProofs: any[][],
  subTreeRoot: Field,
  subTreeRootMerkleProof: any[],
  pendingRcTxRootsCommitment: Field,
  shieldPriKey: PrivateKey
): UInt64 {
  let balance = Circuit.witness<UInt64>(UInt64, () => {
    if (!pendingTxs || pendingTxs.length === 0) {
      return UInt64.zero;
    }
    MerkleTree.validateProof(
      subTreeRootMerkleProof,
      Poseidon.hash([subTreeRoot]),
      pendingRcTxRootsCommitment
    ).assertEquals(true);

    let sums = UInt64.zero;
    for (let i = 0; i < pendingTxs.length; i++) {
      MerkleTree.validateProof(
        pendingTxMerkleProofs[i],
        pendingTxs[i].hash(),
        subTreeRoot
      ).assertEquals(true);

      let ac = pendingTxs[i].getShieldTxReceiptSecret(shieldPriKey);
      sums = sums.add(ac.amount);
    }

    return sums;
  });

  return balance;
}
