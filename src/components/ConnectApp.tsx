import * as React from 'react';
import { Modal, Button, Input, Typography, Anchor} from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import Login from '@/components/Login'
import Register from '@/components/Register'

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
  const [goRegister, setGoRegister]  = React.useState(false);

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

  if (!goRegister) {
    return (
      <>
        <LoginBtn setVisible={setVisible}/>
        <AntModalWrapper>
          <Modal
            getContainer={false}
            closable={true}
            visible={visible}
            onCancel={()=>{setVisible(false);}}
            footer={null}
          >
            <Login handleGoRegisterClick={handleGoRegisterClick} />
          </Modal>
        </AntModalWrapper>
      </>
    );
  }

  return (
    <>
      <LoginBtn setVisible={setVisible}/>
      <AntModalWrapper>
        <Modal
          getContainer={false}
          closable={true}
          visible={visible}
          onCancel={()=>{setVisible(false);}}
          footer={null}
        >
          <Register handleGoBackClick={handleGoBackClick} />
        </Modal>
      </AntModalWrapper>
    </>
  );
};

const LoginBtn = (props) => {
  let {setVisible} = props;

  const showModal = () => {
    setVisible(true);
  };

  return <Button className={styles.logInBtn} onClick={showModal}> Log in </Button>
}
