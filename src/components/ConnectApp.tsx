import * as React from 'react';
import { Modal, Button, Input, Typography, Anchor} from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import Login from '@/components/Login'
import Register from '@/components/Register'

const AntModalWrapper = styled.div`
  .ant-modal-content {
    border-radius: 20px;
    border-color:rgb(255, 200, 90);
    border-style:solid;
    border-width:4px;
    width:25rem;
    padding:1.2rem;
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
            footer={[]}
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
          footer={[]}
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
