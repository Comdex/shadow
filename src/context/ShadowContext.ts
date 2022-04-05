import { Account } from '@/common/models/account2';
import React from 'react'

export class ShadowData {
  public layer2FeeFixed: number = 0.0001;
  public layer1FeePersent: number = 0.0015;
}

export const ShadowContext = React.createContext<ShadowData>(new ShadowData());

