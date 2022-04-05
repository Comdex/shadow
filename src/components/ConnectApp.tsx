import * as React from 'react';
import { Modal, Button, Input, Typography, Anchor } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import Login from '@/components/Login'
import Register from '@/components/Register'
import { LoginInit } from './LoginInit';
import RegisterInit from './RegisterInit';
import { Account, AccountSecret } from '@/common/models/account2';
import { SessionContext } from '@/context/SessionContext';

const AntModalWrapper = styled.div`
  .ant-modal-content {
    border-radius: 8px;
    width:25rem;
    padding:1.2rem;
    background-color: #FFFFCC;
  }
`
export const ConnectApp = () => {
  const [visible, setVisible] = React.useState(false);
  const [loginInit, setLoginInit] = React.useState(false);
  const [goRegister, setGoRegister] = React.useState(false);
  const [registerInit, setRegisterInit] = React.useState(false);
  const [registerInitData, setRegisterInitData] = React.useState<AccountSecret>(null);
  const [logout, setLogout] = React.useState(false);

  console.log(' loginInit==', loginInit, ' goRegister==', goRegister, 'registerInit==', registerInit, ' registerInitData==', registerInitData, ' logout', logout);

  const handleGoRegisterClick = (
    e: React.MouseEvent<HTMLElement>,
    link: {
      title: React.ReactNode;
      href: string;
    },
  ) => {
    e.preventDefault();
    setGoRegister(true);
  };

  const handleGoBackClick = () => {
    setGoRegister(false);
  };

  if (goRegister) {
    return (
      <>
        <LoginBtn setVisible={setVisible} />
        <AntModalWrapper>
          <Modal
            getContainer={false}
            closable={true}
            visible={visible}
            onCancel={() => { setVisible(false); }}
            footer={null}
          >
            <Register handleGoBackClick={handleGoBackClick} setLoginInit={setLoginInit} setGoRegister={setGoRegister} setRegisterInit={setRegisterInit} setRegisterInitData={setRegisterInitData} setLogout={setLogout} />
          </Modal>
        </AntModalWrapper>
      </>
    );
  }

  if (registerInit) {
    return (
      <>
        <LoginBtn setVisible={setVisible} />
        <AntModalWrapper>
          <Modal
            getContainer={false}
            closable={false}
            visible={visible}
            onCancel={() => { setVisible(false); }}
            footer={null}
          >
            <RegisterInit registerInitData={registerInitData} setRegisterInit={setRegisterInit} setLogout={setLogout} />
          </Modal>
        </AntModalWrapper>
      </>
    );
  }

  if (loginInit) {
    return (
      <>
        <LoginBtn setVisible={setVisible} />
        <AntModalWrapper>
          <Modal
            getContainer={false}
            closable={false}
            visible={visible}
            onCancel={() => { setVisible(false); }}
            footer={null}
          >
            <LoginInit handleGoRegisterClick={handleGoRegisterClick} setLoginInit={setLoginInit} />
          </Modal>
        </AntModalWrapper>
      </>
    );
  }

  if (logout) {
    return <LogoutBtn setVisible={setVisible} setLoginInit={setLoginInit} setGoRegister={setGoRegister} setRegisterInit={setRegisterInit} setRegisterInitData={setRegisterInitData} setLogout={setLogout} />;
  }

  return (
    <>
      <LoginBtn setVisible={setVisible} />
      <AntModalWrapper>
        <Modal
          getContainer={false}
          closable={true}
          visible={visible}
          onCancel={() => { setVisible(false); }}
          footer={null}
        >
          <Login handleGoRegisterClick={handleGoRegisterClick} setLoginInit={setLoginInit} />
        </Modal>
      </AntModalWrapper>
    </>
  );
};

const LoginBtn = (props) => {
  let { setVisible } = props;

  const showModal = () => {
    setVisible(true);
  };

  return <Button className={styles.logInBtn} onClick={showModal}> Log in </Button>
}

const LogoutBtn = (props) => {
  let { setVisible, setLoginInit, setGoRegister, setRegisterInit, setRegisterInitData, setLogout } = props;
  let sessionData = React.useContext(SessionContext);

  return <Button className={styles.logInBtn} onClick={() => {
    sessionData.account = null;
    setLoginInit(false);
    setGoRegister(false);
    setRegisterInit(false);
    setRegisterInitData(null);
    setLogout(false);
    setVisible(false);
  }}> Log out </Button>
}
