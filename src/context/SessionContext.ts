import { Account } from '@/common/models/account2';
import React from 'react'

export class SessionData {
  public account: Account;

}

export const SessionContext = React.createContext<SessionData>(new SessionData());
