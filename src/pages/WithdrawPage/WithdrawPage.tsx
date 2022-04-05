import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { AmountSuggest } from '@/components/AmountSuggest';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { OpFeePanel } from '@/components/OpFeePanel';
import { WalletTrigger } from '@/components/WalletTrigger';
import { TokenInputPanel } from '@/components/TokenInputPanel';
import { BizEnums } from '@/common/enums/BizEnums';

let amountToWallet = 0;

export const WithdrawPage: React.FC<any> = (props) => {
  const [visible, setVisible] = React.useState(true);

  const amountBackToParent = (amount0: number) => {
    amountToWallet = amount0;
    console.log('amountBackToParent...amountToWallet=', amountToWallet);
    //setAmountToTriggerWalletBtnState(amount0);
  }

  return (
    <div className={styles.depositContainer}>
      <TokenInputPanel tagName={BizEnums.Withdraw} setAmountToTriggerWallet={amountBackToParent} />
      <div>
        <span>Recipient address</span><br />
        <Input placeholder="recipient address" />
      </div>
      <div>
        <span>Your passcode</span><br />
        <Input placeholder="your passcode" />
      </div>
      <div><OpFeePanel /></div>
      <div>
        <WalletTrigger tagName={BizEnums.Withdraw} />
      </div>
    </div>
  );
}
