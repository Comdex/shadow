import React, { useState } from 'react'
import { Button, Input, Typography } from 'antd';
import BasicUtils from "@/common/BasicUtils";
import { AccountSecret, Account } from "@/common/models/account2";
import { WalletPluginPanelContext } from '@/context/PageContext';

const { Title } = Typography;

let nameExist = true;

const Register = (props) => {
  let { handleGoBackClick, setGoRegister, setRegisterInit, setRegisterInitData, setLogout } = props;
  const goRegister = async () => {
    if (!nameExist) {
      let name0 = (document.querySelector('#registerName') as HTMLInputElement).value;
      let passcode0 = (document.querySelector('#registerPasscode') as HTMLInputElement).value;

      setGoRegister(false);
      setRegisterInit(true);
      setRegisterInitData(new AccountSecret(name0, 0, passcode0));
      console.log('go initialize registration...');
    }
  }

  return <div>
    <Title level={3}>Connect to application</Title>
    <div style={{ 'marginBottom': '5px' }}>
      <RegisterInput />
    </div>
    <div style={{ 'marginBottom': '20px', 'borderBottom': '2px' }}>
      <Input.Password placeholder="Your Passcode" id={'registerPasscode'} />
    </div>
    <div style={{ 'marginBottom': '5px' }}>
      <Button onClick={goRegister} block={true}>Register</Button>
    </div>
    <Button onClick={handleGoBackClick} block={true}>Go back</Button>
    <br />
  </div >
}

const RegisterInput: React.FC<any> = (props) => {
  const [prompt, setPrompt] = useState('none');

  const nameInputOnchange = e => {
    if (!BasicUtils.checkIfExistingName(e.target.value)) {
      nameExist = true;
      // prompt user
      setPrompt('block');
      console.log('it is an existing name...');
    } else {
      nameExist = false;
      // prompt user
      setPrompt('none');
      console.log('it is a new name...');
    }
  };

  return <div>
    <div style={{ color: 'red', display: prompt }} id={'promptExistDiv'}><span>!existing user!</span></div>
    <Input placeholder="Your Unique Name" id={'registerName'} showCount allowClear maxLength={20} onChange={nameInputOnchange} />
  </div>
}

export default Register;

