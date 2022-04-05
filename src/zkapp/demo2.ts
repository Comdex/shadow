import { MerkleTree } from '../lib/merkle_proof/merkle_tree';
import { decryptToModel } from '../lib/utils/encrypt';
import { Account, AccountSecret } from '../models/account';
import { AccountDb, NullifierHashesDb, PendingTxDb } from '../models/store';
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
  Optional
} from 'snarkyjs';
import { TxReceiptSecret } from '../models/tx';
import { encrypt } from 'snarkyjs/dist/server/lib/encryption';
import { AccountCipherText, PrivateKeyCipherText } from '../models/cipher_text';
export { Shadow };

const registerEvent: Field = new Field(9999);

class Shadow extends SmartContract {
  @state(Field) accountsCommitment = State<Field>();
  @state(Field) pendingTxsCommitment = State<Field>();
  @state(Field) nullifierHashesCommitment = State<Field>();

  deploy(
    initialBalance: UInt64,
    accountsCommitment: Field,
    pendingTxsCommitment: Field,
    nullifierHashesCommitment: Field
  ) {
    super.deploy();
    this.balance.addInPlace(initialBalance);
    this.accountsCommitment.set(accountsCommitment);
    this.pendingTxsCommitment.set(pendingTxsCommitment);
    this.nullifierHashesCommitment.set(nullifierHashesCommitment);
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
      account.value.accountSecret,
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
      account.value.accountSecret,
      acPriKey,
      AccountSecret
    );
    accountSecret.balance = accountSecret.balance.add(amount);
    let newAccountSecretText = encrypt(accountSecret.toFields(), account.value.pubKey);
    account.value.accountSecret = newAccountSecretText;
    accountDb.set(nameHash, account.value);
  }

  @method async deposit(
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
