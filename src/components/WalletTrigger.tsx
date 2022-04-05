import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import { WalletPluginPanelContext } from '@/context/PageContext'
import { BizEnums } from '@/common/enums/BizEnums';
import { SessionContext } from '@/context/SessionContext';
import { WalletContext } from '@/context/WalletContext';
import styled from 'styled-components'
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom'
import { WalletTriggerTempObj } from './ConnectApp';

const { Title } = Typography;
const AntModalWrapper = styled.div`
  .ant-modal-content {
    border-radius: 8px;
    width:25rem;
    padding:1.2rem;
    background-color: #FFFFCC;
  }
`

let setVisible0: any;

const WalletTriggerModel = (props) => {
  let { tagName, showable } = props;
  switch (tagName) {
    // case BizEnums.Deposit:
    //   return <DepositInit />
    case BizEnums.Transfer:
      return <TransferInit />
    default:
      return <WithdrawInit />
  }
}

const centerStyle = {
  'display': 'flex',
  'justifyContent': 'center'
}

export const WalletTrigger = (props) => {
  const [amountToWallet, setAmountToWallet] = React.useState(0);
  const history = useHistory();
  const location = useLocation();
  console.log("WalletTrigger.location=", location);

  // let { tagName, setAmountToWalletCallback } = props;
  // setAmountToWalletCallback(setAmountToWallet);
  let { tagName } = props;

  let walletPluginPanelContext = React.useContext(WalletPluginPanelContext);
  let sessionData = React.useContext(SessionContext);
  let walletData = React.useContext(WalletContext);

  let isDisabled = sessionData.account ? false : true;

  let callBackFunc = (amountToWallet: number) => { };
  let btnTxt = '';
  switch (tagName) {
    case BizEnums.Deposit:
      btnTxt = 'Deposit';
      callBackFunc = (amountToWallet) => {
        console.log('Deposit to trigger wallet and callback...');
        (document.querySelector("#waitingDepositTxConfirmation") as HTMLElement).style.display = 'block';

        setTimeout(() => {
          (document.querySelector("#depositTxConfirmed") as HTMLElement).style.display = 'block';

          console.log('sessionData.account.secret.balance before:' + sessionData.account.secret.balance);
          if (amountToWallet > 0) {
            sessionData.account.secret.balance += amountToWallet;
          }
          console.log('sessionData.account.secret.balance later:' + sessionData.account.secret.balance);

          setTimeout(() => {
            WalletTriggerTempObj.setDepositInitVisable(false);
            console.log("location:", location);
            history.push(location.pathname);
          }, 1000);
        }, 1500);
      };
      break;
    case BizEnums.Transfer:
      btnTxt = 'Transfer';
      callBackFunc = (amountToWallet) => {
        if (sessionData.account.secret.balance >= amountToWallet && amountToWallet > 0) {
          setVisible0(true);
          setTimeout(() => {
            console.log('sessionData.account.secret.balance before:' + sessionData.account.secret.balance);
            sessionData.account.secret.balance -= amountToWallet;
            console.log('sessionData.account.secret.balance later:' + sessionData.account.secret.balance);

            console.log("location:", location);
            history.push(location.pathname);

            setVisible0(false);
          }, 2000);
        }

      };
      break;
    default:
      btnTxt = 'Withdraw'
      callBackFunc = (amountToWallet) => {
        if (sessionData.account.secret.balance >= amountToWallet && amountToWallet > 0) {
          setVisible0(true);
          setTimeout(() => {
            console.log('sessionData.account.secret.balance before:' + sessionData.account.secret.balance);
            sessionData.account.secret.balance -= amountToWallet;
            walletData.balance += amountToWallet;
            console.log('sessionData.account.secret.balance later:' + sessionData.account.secret.balance);

            console.log("location:", location);
            history.push(location.pathname);

            setVisible0(false);
          }, 2000);
        }

      };
      break;
  }

  return (
    <div style={centerStyle}>
      <Button className={styles.encryptBtn}
        onClick={() => {
          let xamountToWallet = (document.querySelector('#tokenAmountInput') as HTMLInputElement).value;
          console.log("deposit " + xamountToWallet + "trigger wallet...");
          if (!xamountToWallet) {
            console.log("cannot trigger wallet...");
            return;
          }

          switch (tagName) {
            case BizEnums.Withdraw:
              callBackFunc(Number.parseInt(xamountToWallet));
              break;
            case BizEnums.Transfer:
              callBackFunc(Number.parseInt(xamountToWallet));
              break;
            default:
              WalletTriggerTempObj.setDepositInitVisable(true);
              setTimeout(() => {
                walletPluginPanelContext.currentCallBack = callBackFunc;
                walletPluginPanelContext.amount = Number.parseInt(xamountToWallet);
                walletPluginPanelContext.setVisible(true);
              }, 1000);
              break;
          }

        }}
        disabled={isDisabled}
      >
        {btnTxt}
      </Button>
      <WalletTriggerModel tagName={tagName} showable={isDisabled} />
    </div >
  );
}

const TransferInit = (props) => {
  const [visible, setVisible] = React.useState(false);
  setVisible0 = setVisible;

  return <AntModalWrapper>
    <Modal
      getContainer={false}
      closable={false}
      visible={visible}
      onCancel={() => { setVisible(false); }}
      footer={null}
    >
      <div>
        <Title level={3}>Transfer...</Title>
        <Title level={4}>process...</Title>
        <div>
          <h6>validating key proof...</h6>
          <h6>encrypting new balance...</h6>
          <h6>generating proof...</h6>
          <h6>generating an internal transaction...</h6>
        </div>
        <div id={'waitingTransferTxConfirmation'} style={{ display: 'none' }}>
          <h5>send to rollup server...</h5>
        </div>
      </div >
    </Modal>
  </AntModalWrapper>
}

const WithdrawInit = (props) => {
  const [visible, setVisible] = React.useState(false);
  setVisible0 = setVisible;

  return <AntModalWrapper>
    <Modal
      getContainer={false}
      closable={false}
      visible={visible}
      onCancel={() => { setVisible(false); }}
      footer={null}
    >
      <div>
        <Title level={3}>Transfer...</Title>
        <Title level={4}>process...</Title>
        <div>
          <h6>validating key proof...</h6>
          <h6>encrypting new balance...</h6>
          <h6>generating proof...</h6>
          <h6>generating an internal transaction...</h6>
        </div>
        <div id={'waitingWithdrawTxConfirmation'} style={{ display: 'none' }}>
          <h5>send to rollup server...</h5>
        </div>
      </div >
    </Modal>
  </AntModalWrapper>
}
