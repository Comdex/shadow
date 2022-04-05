import { Account } from '@/common/models/account2';
import React from 'react'

export class WalletData {
  balance: number = 10;
  publicKey: string = 'B62qpaQoLTbc5hAiKN4JkxjkcBikokQjMn1tXWU9LRHFh2KhE7XaEz6';
  privateKey: string = 'EKE9mmmfZXmrjqadHesSKm4Ujh686Rx37rqvMfBSCYZdnbhcQ2Ve';
}

export const WalletContext = React.createContext<WalletData>(new WalletData());
