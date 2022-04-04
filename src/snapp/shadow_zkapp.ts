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
  UInt32
} from 'snarkyjs';
import { Account, AccountSecret } from '../models/account';
import { AccountCipherText, PrivateKeyCipherText } from '../models/cipher_text';
import { MerkleTree } from '../lib/merkle_proof/merkle_tree';

export { ShadowZkapp };

const registerEvent: Field = new Field(9999);

class ShadowZkapp extends SmartContract {
  @state(Field) accountsCommitment = State<Field>();
  @state(Field) pendingRcTxRootsCommitment = State<Field>();

  deploy(initialBalance: UInt64, accountsCommitment: Field, pendingRcTxRootsCommitment: Field) {
    super.deploy();
    this.self.balance.addInPlace(initialBalance);
    this.accountsCommitment.set(accountsCommitment);
    this.pendingRcTxRootsCommitment.set(pendingRcTxRootsCommitment);

    let perms = Permissions.default();
    perms.receive = Perm.proof();
    perms.editState = Perm.proof();
    this.self.update.permissions.setValue(perms);
  }

  @method async register(name: Field[], newAccount: AccountSecret, walletPubKey: PublicKey) {
    newAccount.balance.assertEquals(UInt64.zero);
    newAccount.pwdHash.equals(Field.zero).assertEquals(false);

    //generate shield keypair
    const shieldPriKey = PrivateKey.random();
    const shieldPubKey = shieldPriKey.toPublicKey();

    let shieldPriKeyData: Field[] = shieldPriKey.toFields();
    //encrypt the prikey to save
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

  @method async aggBalance(
    name: Field[],
    acPriKey: PrivateKey,
    accountDb: AccountDb,
    pendingTxDb: PendingTxDb
  ): Promise<UInt64> {
    const accountsCommitment = await this.accountsCommitment.get();
    const pendingTxCommitment = await this.pendingTxsCommitment.get();

    let nameHash = Poseidon.hash(name).toString();

    let account: Optional<Account> = accountDb.get(nameHash);
    MerkleTree.validateProof(
      accountDb.getProof(account.value.hash()),
      account.value.hash(),
      accountsCommitment
    ).assertEquals(true);

    let pendingTxPool = pendingTxDb.get(nameHash);
    MerkleTree.validateProof(
      pendingTxDb.getProof(pendingTxPool.value.hash()),
      pendingTxPool.value.hash(),
      pendingTxCommitment
    ).assertEquals(true);

    let amount = UInt64.zero;
    for (let i = 0; i < pendingTxPool.value.txs.length; i++) {
      let tx = decryptToModel<TxReceiptSecret>(
        pendingTxPool.value.txs[i],
        acPriKey,
        TxReceiptSecret
      );
      amount = amount.add(tx.amount);
    }

    let accountSecret = decryptToModel<AccountSecret>(
      account.value.secret,
      acPriKey,
      AccountSecret
    );
    return accountSecret.balance.add(amount);
  }

  //TODO
  @method async updateBalance(
    name: Field[],
    acPriKey: PrivateKey,
    accountDb: AccountDb,
    pendingTxDb: PendingTxDb
  ) {
    const accountsCommitment = await this.accountsCommitment.get();
    const pendingTxCommitment = await this.pendingTxsCommitment.get();

    let nameHash = Poseidon.hash(name).toString();

    let account: Optional<Account> = accountDb.get(nameHash);
    MerkleTree.validateProof(
      accountDb.getProof(account.value.hash()),
      account.value.hash(),
      accountsCommitment
    ).assertEquals(true);

    let pendingTxPool = pendingTxDb.get(nameHash);
    MerkleTree.validateProof(
      pendingTxDb.getProof(pendingTxPool.value.hash()),
      pendingTxPool.value.hash(),
      pendingTxCommitment
    ).assertEquals(true);

    let amount = UInt64.zero;
    for (let i = 0; i < pendingTxPool.value.txs.length; i++) {
      let tx = decryptToModel<TxReceiptSecret>(
        pendingTxPool.value.txs[i],
        acPriKey,
        TxReceiptSecret
      );
      amount = amount.add(tx.amount);
    }

    let accountSecret = decryptToModel<AccountSecret>(
      account.value.secret,
      acPriKey,
      AccountSecret
    );
    accountSecret.balance = accountSecret.balance.add(amount);
    let newAccountSecretText = encrypt(accountSecret.toFields(), account.value.pubKey);
    account.value.secret = newAccountSecretText;
    accountDb.set(nameHash, account.value);
  }

  @method async depositcc(
    name: Field[],
    acPriKey: PrivateKey,
    amount: UInt64,
    accountDb: AccountDb,
    pendingTxDb: PendingTxDb,
    nullifierHashesDb: NullifierHashesDb
  ) {
    const isRegistered = await this.registered(name, accountDb);
    isRegistered.assertEquals(false);

    const accountsCommitment = await this.accountsCommitment.get();
    const pendingTxCommitment = await this.pendingTxsCommitment.get();
    const nullifierHashesCommitment = await this.nullifierHashesCommitment.get();
    let nameHash = Poseidon.hash(name).toString();

    let account: Optional<Account> = accountDb.get(nameHash);
    MerkleTree.validateProof(
      accountDb.getProof(account.value.hash()),
      account.value.hash(),
      accountsCommitment
    ).assertEquals(true);

    let pendingTxPool = pendingTxDb.get(nameHash);
    MerkleTree.validateProof(
      pendingTxDb.getProof(pendingTxPool.value.hash()),
      pendingTxPool.value.hash(),
      pendingTxCommitment
    ).assertEquals(true);
  }
}

function emitEvent(index: Field, desc: Field[]) {}
