import {
  arrayProp,
  Bool,
  branch,
  Circuit,
  CircuitValue,
  Encryption,
  Field,
  Poseidon,
  PrivateKey,
  proofSystem,
  ProofWithInput,
  prop,
  PublicKey,
  UInt32,
  UInt64
} from 'snarkyjs';
import { MerkleTree } from '../lib/merkle_proof/merkle_tree';
import { Account, AccountSecret } from '../models/account';
import { AccountCipherText, PrivateKeyCipherText, TxCipherText } from '../models/cipher_text';
import { ShieldTxReceipt, ShieldTxReceiptSecret } from '../models/tx';

export class TransferArgs extends CircuitValue {
  @prop accountsCommitment: Field;
  @prop finalAccount: Account;
  @arrayProp(Field, 10) mergedPendingTxCommitments: Field[];
  @prop newPendingTx: ShieldTxReceipt;
  @prop newOwnPendingTx: ShieldTxReceipt;
  @prop fee: UInt32;

  constructor(
    accountsCommitment: Field,
    finalAccountc: Account,
    mergedPendingTxCommitments: Field[],
    newPendingTx: ShieldTxReceipt,
    newOwnPendingTx: ShieldTxReceipt,
    fee: UInt32
  ) {
    super();
    this.accountsCommitment = accountsCommitment;
    this.finalAccount = finalAccountc;
    this.mergedPendingTxCommitments = mergedPendingTxCommitments;
    this.newPendingTx = newPendingTx;
    this.newOwnPendingTx = newOwnPendingTx;
    this.fee = fee;
  }
}

// @proofSystem
// export class RegisterProof extends ProofWithInput<TransferArgs> {
//   @branch
//   static register(name: Field[], pwd: Field[], walletPubKey: PublicKey): RegisterProof {
//     //generate account encrypt keypair
//     const acPriKey = PrivateKey.random();

//     const acPubKey = acPriKey.toPublicKey();

//     let priKeyData: Field[] = acPriKey.toFields();
//     //encrypt the prikey to save
//     let priKeyCipher = Encryption.encrypt(priKeyData, walletPubKey);
//     let priKeyCipherText = new PrivateKeyCipherText(
//       priKeyCipher.publicKey,
//       priKeyCipher.cipherText
//     );

//     let accountSecret = new AccountSecret(name, UInt64.zero, Poseidon.hash(pwd), Field.random());
//     let accountSecretCipher = Encryption.encrypt(accountSecret.toFields(), acPubKey);
//     let accountCipherText = new AccountCipherText(
//       accountSecretCipher.publicKey,
//       accountSecretCipher.cipherText
//     );

//     let nameHash = Poseidon.hash(name);
//     let account = new Account(nameHash, acPubKey, priKeyCipherText, accountCipherText);

//     return new RegisterProof(account);
//   }
// }

@proofSystem
export class TransferProof extends ProofWithInput<TransferArgs> {
  static mergeBalance(
    pendingTxs: ShieldTxReceipt[], //max 10
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

      for (let i = 0; i < pendingTxs.length; i++) {
        MerkleTree.validateProof(
          pendingTxMerkleProofs[i],
          pendingTxs[i].hash(),
          subTreeRoot
        ).assertEquals(true);
      }

      let sums = UInt64.zero;
      for (let i = 0; i < pendingTxs.length; i++) {
        let ac = pendingTxs[i].getShieldTxReceiptSecret(shieldPriKey);
        sums = sums.add(ac.amount);
      }

      return sums;
    });

    return balance;
  }

  @branch
  static transfer(
    accountsCommitment: Field,
    account: Account,
    accountMerkleProof: any[],
    accountName: Field[],
    receiver: Account,
    receiverMerkleProof: any[],
    receiverName: Field[],
    pendingTxs: ShieldTxReceipt[], //max 15
    pendingTxMerkleProofs: any[][],
    subTreeRoot: Field,
    subTreeRootMerkleProof: any[],
    pendingRcTxRootsCommitment: Field,
    shieldPriKey: PrivateKey,
    amount: UInt64,
    fee: UInt32
  ): TransferProof {
    MerkleTree.validateProof(accountMerkleProof, account.hash(), accountsCommitment).assertEquals(
      true
    );

    MerkleTree.validateProof(receiverMerkleProof, receiver.hash(), accountsCommitment).assertEquals(
      true
    );

    let ac = account.getAccountSecret(shieldPriKey);
    ac.balance.lt(UInt64.zero).assertEquals(false); // must >= 0

    let sumBalance = this.mergeBalance(
      pendingTxs,
      pendingTxMerkleProofs,
      subTreeRoot,
      subTreeRootMerkleProof,
      pendingRcTxRootsCommitment,
      shieldPriKey
    );
    ac.balance = ac.balance.add(sumBalance).sub(amount).sub(fee);

    ac.balance.sub(amount).sub(fee).lt(UInt64.zero).assertEquals(false);

    let txSecret = ShieldTxReceiptSecret.createInternalTxSecret(
      accountName,
      receiverName,
      amount,
      Field.random()
    );
    let secretData = txSecret.toFields();
    let cipherText = Encryption.encrypt(secretData, receiver.shieldPubKey);
    let ownCipherText = Encryption.encrypt(secretData, account.shieldPubKey);
    let txCipherText = new TxCipherText(cipherText.publicKey, cipherText.cipherText);
    let ownTxCipherText = new TxCipherText(ownCipherText.publicKey, ownCipherText.cipherText);

    let tx = new ShieldTxReceipt(account.nonce, txCipherText, fee);
    let ownTx = new ShieldTxReceipt(account.nonce, ownTxCipherText, fee);
    account.nonce = account.nonce.add(1);

    account.secret = ac;
  }
}
