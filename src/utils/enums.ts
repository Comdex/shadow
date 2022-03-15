export enum RoutePath {
  Launch = '/'
  // TODO add new Routes here
}

export enum ErrorCode {
  // Errors from RPC
  ErrorFromRPC = -3,
  // Errors from neuron-wallet
  AmountNotEnough = 100,
  AmountTooSmall = 101,
  PasswordIncorrect = 103,
  NodeDisconnected = 104,

  AddressNotFound = 108,

  CurrentWalletNotSet = 111,
  WalletNotFound = 112,
  InvalidKeystore = 113,

  FieldRequired = 201,
  FieldUsed = 202,
  FieldTooLong = 203,
  FieldTooShort = 204,
  FieldInvalid = 205,
  DecimalExceed = 206,
  NotNegative = 207,
  ProtocolRequired = 208,
  NoWhiteSpaces = 209,
  ValueReserved = 210,
  AmountZero = 211,

  FieldIrremovable = 301,
  FieldNotFound = 303,

  AddressIsEmpty = 305,
  MainnetAddressRequired = 306,
  TestnetAddressRequired = 307,
  BalanceNotEnough = 308,
  AddressIsDeprecated = 309,

  // active warning
  WaitForFullySynced = 600,
}
