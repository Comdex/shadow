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
