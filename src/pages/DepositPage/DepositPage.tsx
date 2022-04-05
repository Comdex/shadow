import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { AmountSuggest } from '@/components/AmountSuggest';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { WalletTrigger } from '@/components/WalletTrigger';
import { TokenInputPanel } from '@/components/TokenInputPanel';

export const DepositPage: React.FC<any> = (props) => {
  const [visible, setVisible] = React.useState(true);

  return (
    <div className={styles.depositContainer}>
      <TokenInputPanel tagName={'DepositPage'} />
      <div>
        <WalletTrigger />
      </div>
    </div>
  );
}

