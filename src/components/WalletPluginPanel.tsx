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
    z-index: 9999
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
    walletPluginPanelContext.targetBtn = WalletPluginPanelBtnEnums.Sign;
    walletPluginPanelContext.currentCallBack = () => { }
    setVisible(false);

    // to get pub key & priv key
    currentCallBack();
  }

  const decryptData = () => {
    walletPluginPanelContext.targetBtn = WalletPluginPanelBtnEnums.Sign;
    walletPluginPanelContext.currentCallBack = () => { }
    setVisible(false);

    // to get pub key & priv key
    currentCallBack();
  }

  const signData = () => {
    let amount0 = walletPluginPanelContext.amount;
    console.log('walletPluginPanelContext.amount = ', walletPluginPanelContext.amount);
    if (walletData.balance > walletPluginPanelContext.amount) {
      walletData.balance -= walletPluginPanelContext.amount;
      console.log('after operation, walletData.balance = ', walletData.balance);
    }
    walletPluginPanelContext.targetBtn = WalletPluginPanelBtnEnums.Sign;
    walletPluginPanelContext.currentCallBack = () => { }
    walletPluginPanelContext.amount = 0;

    // to get pub key & priv key
    currentCallBack(amount0);
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
        style={{ 'position': 'fixed', 'top': '0', 'right': '0', 'zIndex': 9999 }}
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
            <h4>
              <span style={{ 'display': (walletPluginPanelContext.amount ? 'inline-block' : 'none') }}>transfer amount: &nbsp;&nbsp;</span>
              <span style={{
                'display': (walletPluginPanelContext.amount ? 'inline-block' : 'none'),
                'color': (walletData.balance < walletPluginPanelContext.amount ? 'red' : 'green')
              }}>
                {walletPluginPanelContext.amount} &nbsp;&nbsp;&nbsp; {walletData.balance < walletPluginPanelContext.amount ? '×' : '√'}
              </span>
            </h4>
          </div>
          <div><Button className={styles.encryptBtn} onClick={encryptData} disabled={WalletPluginPanelBtnEnums.Encryption === targetBtn ? false : true} > encrypt </Button> <br /></div>
          <div><Button className={styles.decryptBtn} onClick={decryptData} disabled={WalletPluginPanelBtnEnums.Decryption === targetBtn ? false : true}> decrypt </Button> <br /></div>
          <div><Button className={styles.signBtn} onClick={signData} disabled={WalletPluginPanelBtnEnums.Sign === targetBtn && walletData.balance >= walletPluginPanelContext.amount ? false : true}> sign </Button> <br /></div>
        </div>
      </Modal>
    </AntModalWrapper >
  );
}

