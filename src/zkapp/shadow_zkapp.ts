import {
  Field,
  PrivateKey,
  PublicKey,
  SmartContract,
  state,
  State,
  method,
  UInt64,
  Poseidon,
  Bool,
  Circuit,
  Encryption,
  Optional,
  Permissions,
  Perm,
  Party,
  UInt32,
  Signature
} from 'snarkyjs';
import { Account, AccountSecret } from '../models/account';
import { AccountCipherText, PrivateKeyCipherText } from '../models/cipher_text';
import { MerkleTree } from '../lib/merkle_proof/merkle_tree';
import { RollupProof } from '../rollup/rollup_proof';

export { ShadowZkapp };

class ShadowZkapp extends SmartContract {
  @state(Field) accountsCommitment = State<Field>();
  @state(Field) pendingRcTxRootsCommitment = State<Field>();
  @state(UInt32) feePerTx = State<UInt32>();
  @state(UInt64) fees = State<UInt64>();
  @state(PublicKey) operator = State<PublicKey>();

  // eslint-disable-next-line max-params
  deploy(
    initialBalance: UInt64,
    accountsCommitment: Field,
    pendingRcTxRootsCommitment: Field,
    feePerTx: UInt32,
    fees: UInt64,
    operator: PublicKey
  ) {
    super.deploy();
    this.self.balance.addInPlace(initialBalance);
    this.accountsCommitment.set(accountsCommitment);
    this.pendingRcTxRootsCommitment.set(pendingRcTxRootsCommitment);
    this.feePerTx.set(feePerTx);
    this.fees.set(fees);
    this.operator.set(operator);

    let perms = Permissions.default();
    perms.receive = Perm.proof();
    perms.editState = Perm.proof();
    this.self.update.permissions.setValue(perms);
  }

  @method
  async register(name: Field[], newAccount: AccountSecret, walletPubKey: PublicKey) {
    newAccount.balance.assertEquals(UInt64.zero);
    newAccount.pwdHash.equals(Field.zero).assertEquals(false);

    // generate shield keypair
    const shieldPriKey = PrivateKey.random();
    const shieldPubKey = shieldPriKey.toPublicKey();

    let shieldPriKeyData: Field[] = shieldPriKey.toFields();
    // encrypt the prikey to save
    let encryptedShieldPriKeyObj = Encryption.encrypt(shieldPriKeyData, walletPubKey);
    let encryptedShieldPriKey = new PrivateKeyCipherText(
      encryptedShieldPriKeyObj.publicKey,
      encryptedShieldPriKeyObj.cipherText
    );

    let encryptedAccountSecretObj = Encryption.encrypt(newAccount.toFields(), shieldPubKey);
    let encryptedAccountSecret = new AccountCipherText(
      encryptedAccountSecretObj.publicKey,
      encryptedAccountSecretObj.cipherText
    );
    let nameHash = Poseidon.hash(name);
    let account = new Account(
      nameHash,
      UInt32.zero,
      shieldPubKey,
      encryptedShieldPriKey,
      encryptedAccountSecret
    );

    this.emitEvent(account);
    const accountsCommitment = await this.accountsCommitment.get();

    /*
    //need to check name unique and save account, calculate new root
    let newAccountsCommitment = MerkleStack.pushCommitment(
      account, accountsCommitment
    );
    this.accountsCommitment.set(newAccountsCommitment);
    */
  }

  // eslint-disable-next-line max-params
  @method
  async deposit(
    depositor: Party<UInt32>,
    depositAmount: UInt64,
    account: Account,
    merkleProof: any,
    shieldPriKey: PrivateKey
  ) {
    const accountsCommitment = await this.accountsCommitment.get();

    MerkleTree.validateProof(merkleProof, account.hash(), accountsCommitment).assertEquals(true);

    let ac = account.getAccountSecret(shieldPriKey);
    ac.balance = ac.balance.add(depositAmount);

    let accountCipherText = ac.encrypt(account.shieldPubKey);
    account.secret = accountCipherText;

    this.balance.addInPlace(depositAmount);
    depositor.balance.subInPlace(depositAmount);

    // let newAccountsCommitment = MerkleStack.pushCommitment(
    //   account, accountsCommitment
    // );
    // this.accountsCommitment.set(newAccountsCommitment);
  }

  @method
  async updateState(rollupProof: RollupProof, operatorSignature: Signature) {
    const operator = await this.operator.get();
    operatorSignature
      .verify(operator, rollupProof.publicInput.target.toFields())
      .assertEquals(true);
    this.accountsCommitment.assertEquals(rollupProof.publicInput.source.accountsCommitment);
    this.pendingRcTxRootsCommitment.assertEquals(
      rollupProof.publicInput.source.pendingRcTxRootsCommitment
    );

    // todo
    // check condition

    this.accountsCommitment.set(rollupProof.publicInput.target.accountsCommitment);
    this.pendingRcTxRootsCommitment.set(rollupProof.publicInput.target.pendingRcTxRootsCommitment);
  }
}
