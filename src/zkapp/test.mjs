import { Encoding, Field, isReady, Poseidon, PrivateKey } from 'snarkyjs';
await isReady;
let priKey = PrivateKey.random();
let pubKey = priKey.toPublicKey();
console.log(priKey.toJSON());
console.log(pubKey.toJSON());
let a = Encoding.Bijective.Fp.fromString('bpolkjuHnVb933258248534AnbcmKL');
let b = Encoding.Bijective.Fp.fromString('good morning');
console.log('a: ' + a.length);
console.log('b: ' + b.length);
console.log('a: ' + Encoding.Bijective.Fp.toString(a));
console.log('b: ' + Encoding.Bijective.Fp.toString(b));
console.log('len: ' + PrivateKey.random().toPublicKey().toFields().length);
export function fieldToHex(field) {
    return '0x' + BigInt(field.toString()).toString(16);
}
let c = Poseidon.hash(b);
console.log(c.toString());
// let d = fieldToHex(c);
// console.log(d);
console.log(c.toBits(256).length);
console.log(new Field(-1).toBits().length);
console.log(Buffer.from(fieldToHex(c), 'hex').slice(0, 32));
