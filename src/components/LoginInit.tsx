import React, { useState } from 'react'
import { Button, Input, Typography } from 'antd';
import BasicUtils from "@/common/BasicUtils";
import { AccountSecret, Account } from "@/common/models/account2";
import { WalletPluginPanelContext } from '@/context/PageContext';

const { Title } = Typography;

export const LoginInit = (props) => {
  return <div>
    <Title level={3}>Loading...</Title>
    <Title level={4}>process...</Title>
  </div >
}
