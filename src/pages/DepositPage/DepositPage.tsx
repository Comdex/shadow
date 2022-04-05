import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { AmountSuggest } from '@/components/AmountSuggest';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { WalletTrigger } from '@/components/WalletTrigger';
import { TokenInputPanel } from '@/components/TokenInputPanel';
import { BizEnums } from '@/common/enums/BizEnums';

let amountToWallet = 0;

export const DepositPage: React.FC<any> = (props) => {
  const [visible, setVisible] = React.useState(true);

  // let setAmountToTriggerWalletBtnState = (amount0: number) => { };
  // const setAmountToWalletCallback = (setAmountToTriggerWalletBtnState1) => {
  //   setAmountToTriggerWalletBtnState = setAmountToTriggerWalletBtnState1;
  // }

  const amountBackToParent = (amount0: number) => {
    amountToWallet = amount0;
    console.log('amountBackToParent...amountToWallet=', amountToWallet);
    //setAmountToTriggerWalletBtnState(amount0);
  }

  return (
    <div className={styles.depositContainer}>
      <TokenInputPanel tagName={BizEnums.Deposit} setAmountToTriggerWallet={amountBackToParent} />
      <div>
        <WalletTrigger tagName={BizEnums.Deposit} amountToWallet={amountToWallet} />
      </div>
    </div>
  );
}

