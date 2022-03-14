import { Field, Group } from 'snarkyjs';

export interface CipherText {
  publicKey: Group;
  cipherText: Field[];
}
