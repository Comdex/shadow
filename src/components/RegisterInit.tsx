import React, { useState } from 'react'
import { Button, Input, Typography } from 'antd';
import BasicUtils from "@/common/BasicUtils";
import { AccountSecret, Account } from "@/common/models/account2";
import { WalletPluginPanelContext } from '@/context/PageContext';
import { WalletPluginPanelBtnEnums } from '@/common/enums/WalletPluginPanelBtnEnums';
import { SessionContext } from '@/context/SessionContext';

const { Title } = Typography;

interface RegisterProof {
  notExistProof: string;
  newAccountRoot: string;
  existProof: string;
}

const RegisterInit = (props) => {
  let { registerInitData, setRegisterInit, setLogout } = props;
  let walletPluginPanelContext = React.useContext(WalletPluginPanelContext);
  let sessionData = React.useContext(SessionContext);

  const getProofAndInsert = (account: Account): RegisterProof => {
    // TODO send to backend api for <notExistProof, newAccountRoot, existProof>

    let notExistProof = "notExistProof";
    let newAccountRoot = "newAccountRoot";
    let existProof = "existProof";
    return { notExistProof, newAccountRoot, existProof };
  }

  const generateRegisterTx = async (registerProof: RegisterProof): Promise<boolean> => {
    return true;
  }

  let name0 = (registerInitData as AccountSecret).name;
  let passcode0 = (registerInitData as AccountSecret).pwdHash;

  let { publicKey, privateKey } = BasicUtils.generateKeypairs();
  let nameHash = BasicUtils.hash(name0);
  let pwdHash = BasicUtils.hash(passcode0);
  let balance = 0;
  let nonce = 0;
  let blinding = BasicUtils.genRandomString();

  let accountSecret = new AccountSecret(nameHash, balance, pwdHash, blinding);
  let account = new Account(nameHash, nonce, publicKey, privateKey, accountSecret);

  let { notExistProof, newAccountRoot, existProof } = getProofAndInsert(account);
  generateRegisterTx({ notExistProof, newAccountRoot, existProof }).then(rs => {
    if (rs) {
      // to encrypt key data
      walletPluginPanelContext.targetBtn = WalletPluginPanelBtnEnums.Encryption;
      walletPluginPanelContext.currentCallBack = () => {
        (document.querySelector("#proofCheckAndGenTx") as HTMLElement).style.display = 'block';

        setTimeout(() => {
          // to sign the Tx
          walletPluginPanelContext.targetBtn = WalletPluginPanelBtnEnums.Sign;
          walletPluginPanelContext.currentCallBack = () => {
            (document.querySelector("#waitingTxConfirmation") as HTMLElement).style.display = 'block';
          };
          walletPluginPanelContext.setVisible(true);

          // to wait for tx confirmed
          setTimeout(() => {
            (document.querySelector("#txConfirmed") as HTMLElement).style.display = 'block';

            // close model, and show logOut btn
            setTimeout(() => {
              sessionData.account = account;

              console.log('to setLogout...');
              setRegisterInit(false);
              setLogout(true);
            }, 1000);
          }, 2000);

        }, 1000);
      };
      walletPluginPanelContext.setVisible(true);
    }
  });

  return <div>
    <Title level={3}>Initializing...</Title>
    <Title level={4}>process...</Title>
    <div>
      <h6>generating Keypairs...</h6>
      <h6>Initializing balance...</h6>
      <h6>Initializing balance...</h6>
      <h6>Hashing passcode...</h6>
      <h6>encrypting private key, balance...</h6>
    </div>
    <div id={'proofCheckAndGenTx'} style={{ display: 'none' }}>
      <h6>validating key proof...</h6>
      <h6>generating a transaction......</h6>
    </div>
    <div id={'waitingTxConfirmation'} style={{ display: 'none' }}>
      <h6>waiting for transaction confirmations...</h6>
    </div>
    <div id={'txConfirmed'} style={{ display: 'none' }}>
      <h6>transaction confirmed...</h6>
      <h6>initialize your personal page...</h6>
    </div>
  </div >
}

const ProofCheckAndGenTx = (props) => {
  let { promptProofCheckAndGenTx } = props;
  return <div>
    <h6>validating key proof...</h6>
    <h6>generating a transaction...</h6>
  </div>
}

const WaitingTxConfirmation = (props) => {
  let { promptWaitingTxConfirmation } = props;
  return <div>
    <h6>waiting for transaction confirmations...</h6>
  </div>
}

export default RegisterInit;

