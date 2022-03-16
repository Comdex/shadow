import { TxReceiptSecret } from "../models/tx";
import { AsFieldElements, Encryption, Field, Poseidon, PrivateKey, PublicKey } from "snarkyjs";
import { CipherText } from "../../models/cipher_text";

// export function encryptByPubKey(data: Field[], pubKey: PublicKey): Field[] {
//     return data;
// }

// export function decryptByPriKey(data: Field[], priKey: PrivateKey): Field[] {
//     return data;
// }

// export function decryptForTxSerect(cipherText: CipherText, priKey: PrivateKey): TxReceiptSecret {
//     let decryptedFields = Encryption.decrypt(cipherText, priKey);
//     return TxReceiptSecret.ofFields(decryptedFields);
// }

export function decryptToModel<T>(cipherText: CipherText, priKey: PrivateKey, eleType: AsFieldElements<T>): T {
    let decryptedFields = Encryption.decrypt(cipherText, priKey);
    return eleType.ofFields(decryptedFields);
}

export function getPubKeyFromWallet(): PublicKey {
    return PrivateKey.random().toPublicKey();
}

export function getEncryptPriKeyFromWallet(): PrivateKey {
    return PrivateKey.random();
}

export function hash(f: Field): Field {
    let fs: Field[] = [];
    fs.push(f);
    return Poseidon.hash(fs);
}

export function encryptByPubKey(msg: Field[], pubKey: PublicKey): CipherText {
    return new CipherText(pubKey.g, pubKey.g, msg);
}

export function decryptByPriKey({ c1, c2, m } : CipherText, priKey: PrivateKey): Field[] {
    return m;
}