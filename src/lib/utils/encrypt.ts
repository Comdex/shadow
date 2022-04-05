import { AsFieldElements, Encryption, Field, Poseidon, PrivateKey, PublicKey } from "snarkyjs";
import { CipherText } from "../../models/cipher_text";


export function decryptToModel<T>(cipherText: CipherText, priKey: PrivateKey, eleType: AsFieldElements<T>): T {
    let decryptedFields = Encryption.decrypt(cipherText, priKey);
    return eleType.ofFields(decryptedFields);
}
