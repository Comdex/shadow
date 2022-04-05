import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { WalletPluginPanelContext } from '@/context/PageContext'
import { WalletPluginPanelBtnEnums } from '@/common/enums/WalletPluginPanelBtnEnums';
import { WalletContext } from '@/context/WalletContext';

const { TextArea } = Input

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
  let walletData = React.useContext(WalletContext);

  let walletPluginPanelContext = React.useContext(WalletPluginPanelContext);
  walletPluginPanelContext.setVisible = setVisible;
  let targetBtn = walletPluginPanelContext.targetBtn;
  let currentCallBack = walletPluginPanelContext.currentCallBack;

  const encryptData = () => {
    // to get pub key & priv key
    currentCallBack();

    walletPluginPanelContext.targetBtn = WalletPluginPanelBtnEnums.Sign;
    walletPluginPanelContext.currentCallBack = () => { }
    setVisible(false);
  }

  const decryptData = () => {
    // to get pub key & priv key
    currentCallBack();

    walletPluginPanelContext.targetBtn = WalletPluginPanelBtnEnums.Sign;
    walletPluginPanelContext.currentCallBack = () => { }
    setVisible(false);
  }

  const signData = () => {
    // to get pub key & priv key
    currentCallBack();

    walletPluginPanelContext.targetBtn = WalletPluginPanelBtnEnums.Sign;
    walletPluginPanelContext.currentCallBack = () => { }
    setVisible(false);
  }

  return (
    <AntModalWrapper>
      <Modal
        getContainer={false}
        closable={false}
        visible={visible}
        onCancel={() => { setVisible(false); }}
        footer={null}
        style={{ 'position': 'fixed', 'top': '0', 'right': '0' }}
      >
        <div className={styles.walletPluginPanel}>
          <div>
            <span>wallet balance:  <span style={{ 'color': 'green' }}>{walletData.balance} Mina</span></span>
          </div>
          <div>
            <span>public key:</span>
            <TextArea id='pubKey' rows={5} value={walletData.publicKey} />
          </div>
          <div>
            <span>private key:</span>
            <TextArea id='privKey' rows={3} value={walletData.privateKey} />
          </div>
          <div><Button className={styles.encryptBtn} onClick={encryptData} disabled={WalletPluginPanelBtnEnums.Encryption === targetBtn ? false : true} > encrypt </Button> <br /></div>
          <div><Button className={styles.decryptBtn} onClick={decryptData} disabled={WalletPluginPanelBtnEnums.Decryption === targetBtn ? false : true}> decrypt </Button> <br /></div>
          <div><Button className={styles.signBtn} onClick={signData} disabled={WalletPluginPanelBtnEnums.Sign === targetBtn ? false : true}> sign </Button> <br /></div>
        </div>
      </Modal>
    </AntModalWrapper>
  );
}

