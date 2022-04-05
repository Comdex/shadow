export class AccountSecret {
  name: string;
  balance: number;
  pwdHash: string;
  blinding: string;

  constructor(
    name: string,
    balance: number = 0,
    pwdHash?: string,
    blinding?: string
  ) {
    this.name = name;
    this.balance = balance;
    this.pwdHash = pwdHash;
    this.blinding = blinding;
  }

  encrypt(shieldPubKey: string): AccountSecret {
    return this;
  }
}

export class Account {
  nameHash: string;
  nonce: number;
  shieldPubKey: string;
  encryptedShieldPriKey: string;
  secret: AccountSecret;

  constructor(
    nameHash: string,
    nonce?: number,
    shieldPubKey?: string,
    encryptedShieldPriKey?: string,
    secret?: AccountSecret
  ) {
    this.nameHash = nameHash;
    this.nonce = nonce;
    this.shieldPubKey = shieldPubKey;
    this.encryptedShieldPriKey = encryptedShieldPriKey;
    this.secret = secret;
  }

  getAccountSecret(shieldPriKey: string): AccountSecret {
    return this.secret;
  }

  getShieldPriKey(walletPriKey: string): string {
    return this.encryptedShieldPriKey;
  }

  hash():string {
    return ""
  }
}
