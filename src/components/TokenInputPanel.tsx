import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { SessionContext } from '@/context/SessionContext';
import { AmountSuggest } from '@/components/AmountSuggest';
import { TokenAmountInput } from '@/components/TokenAmountInput';

export const TokenInputPanel = (props) => {
  let { tagName, amountInput } = props;

  return <div>
    <div>
      <AmountSuggest />
    </div>
    <div>
      <TokenAmountInput tagName={tagName} amountInput={amountInput} />
    </div>
  </div>
}
