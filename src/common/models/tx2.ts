export class ShieldTxReceiptSecret {
  sender: string; // only internal account name
  internalReceiver: string;
  externalReceiver: string;
  amount: number;
  blinding: number; // random number

  constructor (
    sender:  string,
    internalReceiver: string,
    externalReceiver: string,
    amount: number,
    blinding: number
  ) {
    this.sender = sender;
    this.internalReceiver = internalReceiver;
    this.externalReceiver = externalReceiver;
    this.amount = amount;
    this.blinding = blinding;
  }

  static createInternalTxSecret(
    sender: string,
    internalReceiver: string,
    amount: number,
    blinding: number
  ): ShieldTxReceiptSecret {
    return new ShieldTxReceiptSecret(
      sender,
      internalReceiver,
      "",
      amount,
      blinding
    );
  }

  static createExternalTxSecret(
    sender: string,
    externalReceiver: string,
    amount: number,
    blinding: number
  ): ShieldTxReceiptSecret {
    return new ShieldTxReceiptSecret(sender, "", externalReceiver, amount, blinding);
  }

}

export class ShieldTxReceipt {
  nonce: number;
  secret: ShieldTxReceiptSecret;
  fee: number; // charge fee

  constructor(n: number, s: ShieldTxReceiptSecret, f: number) {
    this.nonce = n;
    this.secret = s;
    this.fee = f;
  }

  getShieldTxReceiptSecret(shieldPriKey: string): ShieldTxReceiptSecret {
    return this.secret;
  }
}
