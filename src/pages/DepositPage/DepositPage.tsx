import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { AmountSuggest } from '@/components/AmountSuggest';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { WalletTrigger } from '@/components/WalletTrigger';
import { TokenInputPanel } from '@/components/TokenInputPanel';
import { BizEnums } from '@/common/enums/BizEnums';

export const DepositPage: React.FC<any> = (props) => {
  const [visible, setVisible] = React.useState(true);

  return (
    <div className={styles.depositContainer}>
      <TokenInputPanel tagName={BizEnums.Deposit} />
      <div>
        <WalletTrigger />
      </div>
    </div>
  );
}

