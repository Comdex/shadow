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
import { WalletContext } from '@/context/WalletContext';
import { useHistory } from 'react-router';

const { Title } = Typography;

const AntModalWrapper = styled.div`
  .ant-modal-content {
    border-radius: 8px;
    width:25rem;
    padding:1.2rem;
    background-color: #FFFFCC;
  }
`
export const ConnectApp = (props) => {
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
    return <>
      <LogoutBtn setVisible={setVisible} setLoginInit={setLoginInit} setGoRegister={setGoRegister} setRegisterInit={setRegisterInit} setRegisterInitData={setRegisterInitData} setLogout={setLogout} />;
      <DepositInit />
    </>
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
  let walletData = React.useContext(WalletContext);
  let history = useHistory();

  return <Button className={styles.logInBtn} onClick={() => {
    walletData.balance = 0;
    sessionData.account = null;
    setLoginInit(false);
    setGoRegister(false);
    setRegisterInit(false);
    setRegisterInitData(null);
    setLogout(false);
    setVisible(false);

    history.push("/deposit");
  }}> Log out </Button>
}

export const WalletTriggerTempObj = {
  setDepositInitVisable: (x: boolean): any => { }
};

const DepositInit = (props) => {
  const [visible, setVisible] = React.useState(false);
  WalletTriggerTempObj.setDepositInitVisable = setVisible;

  return <div>
    <AntModalWrapper>
      <Modal
        getContainer={false}
        closable={false}
        visible={visible}
        onCancel={() => { setVisible(false); }}
        footer={null}
      >
        <div>
          <Title level={3}>Depositing...</Title>
          <Title level={4}>process...</Title>
          <div>
            <h6>validating key proof...</h6>
            <h6>encrypting new balance...</h6>
            <h6>generating proof...</h6>
            <h6>generating an external transaction...</h6>
          </div>
          <div id={'waitingDepositTxConfirmation'} style={{ display: 'none' }}>
            <h5 style={{ 'color': 'green' }}>broadcast transaction to MINA mainnet...</h5>
            <h6>waiting for transaction confirmations...</h6>
          </div>
          <div id={'depositTxConfirmed'} style={{ display: 'none' }}>
            <h5 style={{ 'color': 'green' }}>transaction confirmed...</h5>
          </div>
        </div >
      </Modal>
    </AntModalWrapper>
  </div>
}
