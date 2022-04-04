import { Encoding, isReady, PrivateKey } from 'snarkyjs';
await isReady;
let a = Encoding.Bijective.Fp.fromString('bpolkjuHnVb933258248534AnbcmKL');
let b = Encoding.Bijective.Fp.fromString('宝宝你好我们是一家人来的啊谢谢你的关注与支持');
console.log('a: ' + a.length);
console.log('b: ' + b.length);
console.log('a: ' + Encoding.Bijective.Fp.toString(a));
console.log('b: ' + Encoding.Bijective.Fp.toString(b));
console.log('len: ' + PrivateKey.random().toPublicKey().toFields().length);
