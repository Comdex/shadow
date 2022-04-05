import { Account } from '@/common/models/account2';
import React from 'react'

export class WalletData {
  balance: number = 0;
  publicKey: string = 'publicKey_0x73i8eui7dfjksjfdskfldjkafiour3897kdflsjfiuljcxkljfkdjlkfjd';
  privateKey: string = 'privateKey_0x34878456456jkujiofeklfjdfkdljf';
}

export const WalletContext = React.createContext<WalletData>(new WalletData());
