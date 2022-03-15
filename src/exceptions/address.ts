import { ErrorCode } from '@/utils/enums'

const I18N_PATH = `messages.codes.`

export class AddressEmptyException extends Error {
  public code = ErrorCode.AddressIsEmpty
  constructor() {
    super(`${I18N_PATH}${ErrorCode.AddressIsEmpty}`)
  }
}
