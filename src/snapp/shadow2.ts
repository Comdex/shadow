import { MerkleTree } from '@/lib/merkle_proof/merkle_tree';
import { Account, AccountSecret } from '@/models/account';
import { AccountDb, FinishedTxDb, PendingTxDb } from '@/models/store';
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
  Encryption
} from 'snarkyjs';
export { Shadow };

class Shadow extends SmartContract {
  @state(Field) accountsCommitment = State<Field>();
  @state(Field) pendingTxsCommitment = State<Field>();
  @state(Field) finishedTxsCommitment = State<Field>();
  @state(Field) nonceSetCommitment = State<Field>();

  deploy(
    initialBalance: UInt64,
    accountsCommitment: Field,
    pendingTxsCommitment: Field,
    finishedTxsCommitment: Field,
    nonceSetCommitment: Field
  ) {
    super.deploy();
    this.balance.addInPlace(initialBalance);
    this.accountsCommitment.set(accountsCommitment);
    this.pendingTxsCommitment.set(pendingTxsCommitment);
    this.finishedTxsCommitment.set(finishedTxsCommitment);
    this.nonceSetCommitment.set(nonceSetCommitment);
  }

  @method async registered(name: Field[], accountDb: AccountDb): Promise<Bool> {
    const accountsCommitment = await this.accountsCommitment.get();

    let nameHash = Poseidon.hash(name).toString();
    let account = accountDb.get(nameHash);

    return Circuit.if(
      account.isSome,
      MerkleTree.validateProof(
        accountDb.getProof(account.value.hash()),
        account.value.hash(),
        accountsCommitment
      ),
      new Bool(false)
    );
  }

  @method async register(
    name: Field[],
    pwd: Field[],
    walletPubKey: PublicKey,
    accountDb: AccountDb
  ) {
    const isRegistered = await this.registered(name, accountDb);
    isRegistered.assertEquals(false);
    //generate account encrypt keypair
    const acPriKey = PrivateKey.random();
    const acPubKey = acPriKey.toPublicKey();

    let priKeyData: Field[] = acPriKey.toFields();
    //encrypt the prikey to save
    let encryptedAcPriKey = Encryption.encrypt(priKeyData, walletPubKey);

    let accountSecret = new AccountSecret(name, UInt64.zero, Poseidon.hash(pwd));
    let encryptedAccountSecret = Encryption.encrypt(accountSecret.toFields(), acPubKey);
    let account = new Account(acPubKey, encryptedAcPriKey, encryptedAccountSecret);

    accountDb.set(Poseidon.hash(name).toString(), account);
    let accountsNewRoot = accountDb.getMerkleRoot();
    this.accountsCommitment.set(accountsNewRoot);
  }

  @method async rollUp(
    name: Field[],
    acPriKey: PrivateKey,
    accountDb: AccountDb,
    pendingTxDb: PendingTxDb,
    finishedTxDb: FinishedTxDb
  ) {
    const accountsCommitment = await this.accountsCommitment.get();
    const pendingTxCommitment = await this.pendingTxsCommitment.get();
    const finishedTxCommitment = await this.finishedTxsCommitment.get();
    let nameHash = Poseidon.hash(name).toString();

    let account = accountDb.get(nameHash);
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
    );
  }

  @method async deposit(
    name: Field[],
    acPriKey: PrivateKey,
    amount: UInt64,
    accountDb: AccountDb,
    pendingTxDb: PendingTxDb,
    finishedTxDb: FinishedTxDb
  ) {
    const isRegistered = await this.registered(name, accountDb);
    isRegistered.assertEquals(false);
  }
}
