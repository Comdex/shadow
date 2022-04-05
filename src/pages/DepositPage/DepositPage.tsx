import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { AmountSuggest } from '@/components/AmountSuggest';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { WalletTrigger } from '@/components/WalletTrigger';
import { TokenInputPanel } from '@/components/TokenInputPanel';
import { BizEnums } from '@/common/enums/BizEnums';
import { useLocation } from 'react-router';

let amountToWallet = 0;

export const DepositPage: React.FC<any> = (props) => {
  const [visible, setVisible] = React.useState(true);
  let location = useLocation();
  console.log('DepositPage.location=', location);
  let amountInput = location.state ? (location.state['amountInput'] ? location.state['amountInput'] : 0) : 0;

  return (
    <div className={styles.depositContainer}>
      <TokenInputPanel tagName={BizEnums.Deposit} amountInput={amountInput} />
      <div>
        <WalletTrigger tagName={BizEnums.Deposit} amountToWallet={amountInput} />
      </div>
    </div>
  );
}

