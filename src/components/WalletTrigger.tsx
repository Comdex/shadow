import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'

const centerStyle = {
  'display': 'flex',
  'justify-content': 'center',
  'align-items': 'center'
}

export const WalletTrigger = () => {
  return (
    <div style={centerStyle}>
      <Button className={styles.encryptBtn}> Connect Wallet </Button>
    </div>
  );
}
