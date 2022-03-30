import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'

export const AmountSuggestPanel = () => {

  const populateAmount = () => {

  }

  return <>
              <span>suggest amount</span><br />
              <Button onClick={populateAmount}> 0.1 Mina </Button>
              <Button onClick={populateAmount}> 0.3 Mina </Button>
              <Button onClick={populateAmount}> 0.5 Mina </Button>
              <Button onClick={populateAmount}> 1  Mina </Button>
  </>
}


