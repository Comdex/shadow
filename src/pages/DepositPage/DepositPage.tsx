import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import {AmountSuggestPanel} from '@/components/AmountSuggestPanel';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { WalletTrigger } from '@/components/WalletTrigger';

export const DepositPage: React.FC<any> = (props) => {
  const [visible, setVisible] = React.useState(true);

  return (
          <div className={styles.depositContainer}>
            <div>
              <AmountSuggestPanel />
            </div>
            <div>
              <TokenAmountInput />
            </div>
            <div>
              <WalletTrigger />
            </div>
          </div>
  );
}

