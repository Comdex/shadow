import React from 'react'
import { Button, Input, Typography } from 'antd';
import axios from 'axios';
import { Account, AccountSecret } from '@/common/models/account';
import {
  CircuitValue,
  Field,
  prop,
  PublicKey,
  UInt64,
  Encoding,
  Group,
  Poseidon,
  arrayProp,
  UInt32,
  PrivateKey,
  Encryption
} from 'snarkyjs';
import { AccountCipherText, PrivateKeyCipherText } from '@/common/models/cipher_text';

const { Title } = Typography;

const Register = (props) => {
  let { handleGoBackClick } = props;

  const goRegister = (): any => {
    // generate keypairs
    let shieldPubKey: PublicKey = PublicKey.ofFields(Array(255).fill(Field.zero));
    let encryptedShieldPriKey: PrivateKeyCipherText = new PrivateKeyCipherText(
      Group.ofFields(Array(255).fill(Field.zero)),
      Array(257).fill(Field.zero)
    );

    // TODO populate AccountSecret
    let name: Field[]; // max fields: 1
    let balance: UInt64;
    let pwdHash: Field;
    let blinding: Field;
    let accountSecret: AccountSecret = new AccountSecret(name, balance, pwdHash, blinding);
    let secret = accountSecret.encrypt(shieldPubKey);

    // TODO populate Account
    let nameHash: Field;
    let nonce: UInt32;
    let account: Account = new Account(nameHash, nonce, shieldPubKey, encryptedShieldPriKey, secret);

    axios.post('/register', {}).then(
      () => {
        // TODO generate a tx to send to mainnet

      }
    ).catch((e) => e);

  }

  return <div>
    <Title level={3}>Connect to application</Title>
    <div style={{ 'marginBottom': '5px' }}>
      <Input placeholder="Your Unique Name" />
    </div>
    <div style={{ 'marginBottom': '20px', 'borderBottom': '2px' }}>
      <Input.Password placeholder="Your Passcode" />
    </div>
    <div style={{ 'marginBottom': '5px' }}>
      <Button onClick={() => {/* TODO */ }} block={true}>Register</Button>
    </div>
    <Button onClick={handleGoBackClick} block={true}>Go back</Button>
    <br />
  </div>
}

export default Register;
