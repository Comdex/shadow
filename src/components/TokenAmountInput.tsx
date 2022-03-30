import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'

export const TokenAmountInput = () => {

  const populateAmount = () => {

  }

  return <>
              <div style={{display:'flex',justifyContent:'space-around'}}>
                <div>token amount</div>
                <div>balance:0.2 Mina <span style={{'color':'green'}}>Max</span></div>
              </div>
              <div>
                <Input placeholder="token amount" />
              </div>
  </>
}


