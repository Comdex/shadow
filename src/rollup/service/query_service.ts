import { Account, AccountSecret } from '@/models/account';
import { AccountCipherText, PrivateKeyCipherText } from '@/models/cipher_text';
import {
  Encoding,
  Encryption,
  Field,
  Poseidon,
  PrivateKey,
  PublicKey,
  UInt32,
  UInt64
} from 'snarkyjs';

export class QueryService {
  static createAccount(): Account {
    const testPriKey = {
      s: '19445586002793044304000109152686197248217179072404865044426080197988945032070'
    };
    const testPubKey = {
      g: {
        x: '2089597202900849852140369999146606758319211335733045500091682023288632702129',
        y: '7826341398896750788642723332537360048628416391922861652429289139245492359714'
      }
    };

    let walletPubKey = PublicKey.fromJSON(testPubKey);

    let name = 'test';
    let pwd = 'test6666';
    let nameFields = Encoding.Bijective.Fp.fromString(name);
    let nameHash = Poseidon.hash(nameFields);
    let pwdFields = Encoding.Bijective.Fp.fromString(pwd);

    let newAccount = new AccountSecret(
      nameFields,
      UInt64.zero,
      Poseidon.hash(pwdFields),
      Field.random()
    );
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

    let account = new Account(
      nameHash,
      UInt32.zero,
      shieldPubKey,
      encryptedShieldPriKey,
      encryptedAccountSecret
    );

    return account;
  }
}
