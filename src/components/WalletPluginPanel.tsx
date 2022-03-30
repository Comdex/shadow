import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'

const {TextArea} = Input

const AntModalWrapper = styled.div`
  .ant-modal-content {
    position: fixed;
    top: 0;
    right: 0;
    border-radius: 5px;
    border-color:rgb(160, 70, 160);
    border-style:solid;
    border-width:2px;
    width:20rem;
  }
`
export const WalletPluginPanel = () => {
  const [visible, setVisible] = React.useState(false);

  const encryptData = () => {
    // to get pub key & priv key

  }

  const decryptData = () => {
    // to get pub key & priv key
  }

  const signData = () => {
    // to get pub key & priv key
  }

  return (
      <AntModalWrapper>
        <Modal
          getContainer={false}
          closable={true}
          visible={visible}
          onCancel={()=>{setVisible(false);}}
          footer={null}
          style={{'position':'fixed', 'top':'0', 'right':'0'}}
        >
          <div className={styles.walletPluginPanel}>
            <div>
              <span>public key:</span>
              <TextArea id='pubKey' rows={5} />
            </div>
            <div>
              <span>private key:</span>
              <TextArea id='privKey' rows={3} />
            </div>
            <div><Button className={styles.encryptBtn} onClick={encryptData}> encrypt </Button> <br/></div>
            <div><Button className={styles.decryptBtn} onClick={decryptData}> decrypt </Button> <br/></div>
            <div><Button className={styles.signBtn} onClick={signData}> sign </Button> <br/></div>
          </div>
        </Modal>
      </AntModalWrapper>
  );
}

