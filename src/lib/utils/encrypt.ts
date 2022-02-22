import { Field, PrivateKey, PublicKey } from "snarkyjs";

export function encryptByPubKey(data: Field[], pubKey: PublicKey): Field[] {
    return data;
}

export function decryptByPriKey(data: Field[], priKey: PrivateKey): Field[] {
    return data;
}

export function getPubKeyFromWallet(): PublicKey {
    return PrivateKey.random().toPublicKey();
}

export function getEncryptPriKeyFromWallet(): PrivateKey {
    return PrivateKey.random();
}

export function getHash(str: string): string {
    return str;
}