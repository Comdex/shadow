import {
  arrayProp,
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
import { Account } from '../models/account';
import { TxCipherText } from '../models/cipher_text';
import { ShieldTxReceipt, ShieldTxReceiptSecret } from '../models/tx';
import { getTxCommitments, mergeBalance } from './common';

export class TransferArgs extends CircuitValue {
  @prop nameHash: Field;
  @prop accountsCommitment: Field;
  @prop finalAccount: Account;
  @arrayProp(Field, 10) mergedPendingTxCommitments: Field[];
  @prop pendingRcTxRootsCommitment: Field;
  @prop newPendingTx: ShieldTxReceipt;
  @prop newOwnPendingTx: ShieldTxReceipt;
  @prop fee: UInt32;

  // eslint-disable-next-line max-params
  constructor(
    nameHash: Field,
    accountsCommitment: Field,
    finalAccountc: Account,
    mergedPendingTxCommitments: Field[],
    pendingRcTxRootsCommitment: Field,
    newPendingTx: ShieldTxReceipt,
    newOwnPendingTx: ShieldTxReceipt,
    fee: UInt32
  ) {
    super();
    this.nameHash = nameHash;
    this.accountsCommitment = accountsCommitment;
    this.finalAccount = finalAccountc;
    this.mergedPendingTxCommitments = mergedPendingTxCommitments;
    this.pendingRcTxRootsCommitment = pendingRcTxRootsCommitment;
    this.newPendingTx = newPendingTx;
    this.newOwnPendingTx = newOwnPendingTx;
    this.fee = fee;
  }
}

@proofSystem
export class TransferProof extends ProofWithInput<TransferArgs> {
  // eslint-disable-next-line max-params
  @branch
  static withdraw(
    name: Field[],
    pwd: Field[],
    accountsCommitment: Field,
    account: Account,
    accountMerkleProof: any[],
    accountName: Field[],
    receiver: PublicKey,
    pendingTxs: ShieldTxReceipt[], // max 15
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

    let ac = account.getAccountSecret(shieldPriKey);
    let nameHash = Poseidon.hash(name);
    nameHash.assertEquals(Poseidon.hash(ac.name));
    let pwdHash = Poseidon.hash(pwd);
    ac.pwdHash.assertEquals(pwdHash);

    ac.balance.lt(UInt64.zero).assertEquals(false); // must >= 0
    let sumBalance = mergeBalance(
      pendingTxs,
      pendingTxMerkleProofs,
      subTreeRoot,
      subTreeRootMerkleProof,
      pendingRcTxRootsCommitment,
      shieldPriKey
    );
    ac.balance = ac.balance.add(sumBalance).sub(amount).sub(fee);

    ac.balance.sub(amount).sub(fee).lt(UInt64.zero).assertEquals(false);
    let txSecret = ShieldTxReceiptSecret.createExternalTxSecret(
      accountName,
      receiver,
      amount,
      Field.random()
    );
    let secretData = txSecret.toFields();
    let ownCipherText = Encryption.encrypt(secretData, account.shieldPubKey);
    let ownTxCipherText = new TxCipherText(ownCipherText.publicKey, ownCipherText.cipherText);

    let tx = ShieldTxReceipt.zero;
    let ownTx = new ShieldTxReceipt(account.nonce, ownTxCipherText, fee);

    account.secret = ac.encrypt(account.shieldPubKey);
    let txCommitments = getTxCommitments(pendingTxs);

    let args = new TransferArgs(
      nameHash,
      accountsCommitment,
      account,
      txCommitments,
      pendingRcTxRootsCommitment,
      tx,
      ownTx,
      fee
    );
    return new TransferProof(args);
  }

  // eslint-disable-next-line max-params
  @branch
  static transfer(
    name: Field[],
    pwd: Field[],
    accountsCommitment: Field,
    account: Account,
    accountMerkleProof: any[],
    accountName: Field[],
    receiver: Account,
    receiverMerkleProof: any[],
    receiverName: Field[],
    pendingTxs: ShieldTxReceipt[], // max 15
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
    let nameHash = Poseidon.hash(name);
    nameHash.equals(Poseidon.hash(ac.name)).assertEquals(true);
    let pwdHash = Poseidon.hash(pwd);
    ac.pwdHash.assertEquals(pwdHash);

    ac.balance.lt(UInt64.zero).assertEquals(false); // must >= 0

    let sumBalance = mergeBalance(
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

    account.secret = ac.encrypt(account.shieldPubKey);
    let txCommitments = getTxCommitments(pendingTxs);

    let args = new TransferArgs(
      nameHash,
      accountsCommitment,
      account,
      txCommitments,
      pendingRcTxRootsCommitment,
      tx,
      ownTx,
      fee
    );
    return new TransferProof(args);
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
